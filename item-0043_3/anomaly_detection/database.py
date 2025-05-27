import psycopg2
from dotenv import load_dotenv

load_dotenv()


class DatabaseHandler:
    def __init__(self, DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT):
        load_dotenv()

        self.connection = psycopg2.connect(
            dbname="test43",
            user="postgres",
            password="myPassword",
            host="localhost",
            port="5432",
        )
        self.cursor = self.connection.cursor()

    def create_table(self, table_name, columns):
        """Creates a table in the database with specified columns.

        Args:
                    table_name (str): The name of the table to create.
                    columns (list): A list of strings representing the column names and data types.
                                    Each string should be formatted like:
                                    "column_name data_type" (e.g., "Date and Hour VARCHAR(255)")

        Raises:
                    psycopg2.errors.SyntaxError: If there's a syntax error in the SQL query.
        """

        # Ensure column definitions include data types
        data_type_columns = []
        for col in columns:
            col_parts = col.split()
            if len(col_parts) != 2:
                raise ValueError(
                    "Invalid column definition. Each column should be formatted as 'name data_type' (e.g., 'Date and Hour VARCHAR(255)')"
                )
            data_type_columns.append(" ".join(col_parts))  # Rejoin with space

        query = f"""
            CREATE TABLE IF NOT EXISTS {table_name} (
                {", ".join(data_type_columns)}
            );
        """

        self.cursor.execute(query)
        self.connection.commit()

    def insert_data(self, table_name, data):
        """Inserts a single row of data into the specified table.

        Args:
                    table_name (str): The name of the table to insert data into.
                    data (dict): A dictionary containing key-value pairs representing column names and their corresponding values.
        """

        columns = ", ".join(data.keys())
        placeholders = ", ".join(["%s"] * len(data))
        query = f"""
                    INSERT INTO {table_name} ({columns}) VALUES ({placeholders});
                """
        self.cursor.execute(query, tuple(data.values()))
        self.connection.commit()

    def close_connection(self):
        """Closes the connection to the database."""
        self.cursor.close()
        self.connection.close()

    def fetch_new_data(self, table_name, limit):
        """Retrieves the last 'limit' rows from the specified table in ascending order based on the date column.

        Args:
            table_name (str): The name of the table to fetch data from.
            limit (int): The number of rows to retrieve.

        Returns:
            list or None: A list of dictionaries representing the fetched data rows in ascending order, or None if the table doesn't exist.
        """

        query = f""" SELECT * FROM ( SELECT * FROM {table_name} ORDER BY date DESC LIMIT {limit} ) AS subquery ORDER BY date ASC;"""

        try:
            self.cursor.execute(query)
            columns = [desc[0] for desc in self.cursor.description]
            data = [dict(zip(columns, row)) for row in self.cursor.fetchall()]
            return data
        except psycopg2.errors.UndefinedTable:
            return None
