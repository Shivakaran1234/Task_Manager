#!/usr/bin/env python
"""Database inspection and verification script."""

import sqlite3
import sys
from pathlib import Path

DB_PATH = Path(__file__).parent / "tasks.db"

def inspect_database():
    """Inspect the SQLite database and display schema and data."""
    try:
        conn = sqlite3.connect(str(DB_PATH))
        cursor = conn.cursor()
        
        print(f"✅ Connected to database: {DB_PATH}")
        print(f"Database size: {DB_PATH.stat().st_size / 1024:.2f} KB\n")
        
        # Get all tables
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        
        if not tables:
            print("❌ No tables found in database!")
            return
        
        print("📋 Tables:")
        for table in tables:
            table_name = table[0]
            
            # Get table schema
            cursor.execute(f"PRAGMA table_info({table_name});")
            columns = cursor.fetchall()
            
            print(f"\n  {table_name}:")
            for col in columns:
                col_id, col_name, col_type, not_null, default, pk = col
                nullable = "NOT NULL" if not_null else "NULLABLE"
                pk_marker = " (PRIMARY KEY)" if pk else ""
                print(f"    - {col_name}: {col_type} {nullable}{pk_marker}")
            
            # Get row count
            cursor.execute(f"SELECT COUNT(*) FROM {table_name};")
            row_count = cursor.fetchone()[0]
            print(f"    Rows: {row_count}")
            
            # Show sample data
            if row_count > 0:
                cursor.execute(f"SELECT * FROM {table_name} LIMIT 3;")
                rows = cursor.fetchall()
                print(f"    Sample data:")
                for row in rows:
                    print(f"      {row}")
        
        conn.close()
        print("\n✅ Database verification complete!")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    inspect_database()
