package db;

import java.sql.Connection;
import java.sql.DriverManager;

public class DBConnection {

    public static Connection getConnection() {

        try {

            String url = "jdbc:mysql://localhost:3306/tourist_system";
            String username = "root";
            String password = "Nish@1002";

            Connection conn =
                    DriverManager.getConnection(
                            url,
                            username,
                            password
                    );

            System.out.println("Database Connected Successfully!");

            return conn;

        } catch (Exception e) {

            System.out.println("Connection Failed");
            e.printStackTrace();

            return null;
        }
    }
}