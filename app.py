from flask import Flask, request, jsonify
import pandas as pd
import sqlalchemy
from sqlalchemy import create_engine
from sqlalchemy.exc import IntegrityError
from flask_cors import CORS
import numpy as np  

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing

# PostgreSQL Database Connection
password='NewSecurePassword123'
DATABASE_URL = f"postgresql://postgres:{password}@localhost:5432/business_db"
engine = create_engine(DATABASE_URL)

@app.route('/upload', methods=['POST'])
@app.route('/upload', methods=['POST'])
def upload_file():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400

        df = pd.read_csv(file)

        # Ensure required columns exist
        required_columns = {'id', 'date', 'product', 'category', 'quantity_sold', 'revenue', 'profit'}
        if not required_columns.issubset(set(df.columns)):
            return jsonify({"error": "Missing required columns in CSV"}), 400

        df.columns = df.columns.str.lower()  # Convert column names to lowercase
        df["id"] = df["id"].astype(str)  # Convert id to string
        df["date"] = pd.to_datetime(df["date"], errors="coerce")  # Convert date column

        # Remove invalid rows
        df.dropna(inplace=True)

        print("Data ready to be inserted into PostgreSQL:")
        print(df.head())  # Print first few rows to verify data

        # Insert data into PostgreSQL
        df.to_sql("sales_data", engine, if_exists="append", index=False)

        print(" Data successfully inserted into PostgreSQL!")
        return jsonify({"message": "File uploaded & data stored!", "rows_uploaded": len(df)})
    
    except Exception as e:
        print(f" ERROR: {e}")  # Print full error message
        return jsonify({"error": str(e)}), 500








# Fetch data from PostgreSQL
@app.route('/fetch-data', methods=['GET'])
def fetch_data():
    try:
        query = "SELECT * FROM sales_data ORDER BY date DESC;"
        df = pd.read_sql(query, engine)
        return jsonify(df.to_dict(orient="records"))  # Convert DataFrame to JSON
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    
@app.route('/analytics', methods=['GET'])
def get_analytics():
    try:
        start_date = request.args.get("start_date")
        end_date = request.args.get("end_date")

        query = "SELECT * FROM sales_data"
        if start_date and end_date:
            query += f" WHERE date BETWEEN '{start_date}' AND '{end_date}'"

        query += " ORDER BY date DESC;"
        df = pd.read_sql(query, engine)

        if df.empty:
            return jsonify({"error": "No data available"}), 400

        df["date"] = df["date"].astype(str)  # Convert date to string

        # Function to safely convert NumPy int64 to Python int
        def convert_int64(value):
            return int(value) if isinstance(value, (np.int64, np.float64)) else value

        total_revenue = convert_int64(df["revenue"].sum())
        total_profit = convert_int64(df["profit"].sum())
        total_units_sold = convert_int64(df["quantity_sold"].sum())

        # Calculate Average Revenue & Profit Per Day
        unique_days = df["date"].nunique()
        avg_daily_revenue = convert_int64(total_revenue / unique_days) if unique_days > 0 else 0
        avg_daily_profit = convert_int64(total_profit / unique_days) if unique_days > 0 else 0

        # Best-Selling Product
        top_product = df.groupby("product")["quantity_sold"].sum().idxmax()
        top_product_sales = convert_int64(df.groupby("product")["quantity_sold"].sum().max())

        # Best-Selling Category
        top_category = df.groupby("category")["quantity_sold"].sum().idxmax()
        top_category_sales = convert_int64(df.groupby("category")["quantity_sold"].sum().max())

        # Best & Worst Sales Days
        daily_sales = df.groupby("date")["revenue"].sum()
        best_day = daily_sales.idxmax()
        worst_day = daily_sales.idxmin()

        # Profit Margins (Product with Highest & Lowest Profit Margins)
        df["profit_margin"] = df["profit"] / df["revenue"]
        highest_profit_margin_product = df.groupby("product")["profit_margin"].mean().idxmax()
        lowest_profit_margin_product = df.groupby("product")["profit_margin"].mean().idxmin()

        return jsonify({
            "total_revenue": total_revenue,
            "total_profit": total_profit,
            "avg_daily_revenue": avg_daily_revenue,
            "avg_daily_profit": avg_daily_profit,
            "total_units_sold": total_units_sold,
            "top_product": top_product,
            "top_product_sales": top_product_sales,
            "top_category": top_category,
            "top_category_sales": top_category_sales,
            "best_day": best_day,
            "worst_day": worst_day,
            "highest_profit_margin_product": highest_profit_margin_product,
            "lowest_profit_margin_product": lowest_profit_margin_product
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500




if __name__ == '__main__':
    app.run(debug=True)
