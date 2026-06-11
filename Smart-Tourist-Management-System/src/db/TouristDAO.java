package db;

import model.Tourist;
import java.sql.Connection;
import java.sql.PreparedStatement;

public class TouristDAO {

    public static void addTourist(Tourist tourist) {

        try {

            Connection conn = DBConnection.getConnection();

            String sql =
                    "INSERT INTO tourists(name,email,phone,city) VALUES(?,?,?,?)";

            PreparedStatement pst =
                    conn.prepareStatement(sql);

            pst.setString(1, tourist.getName());
            pst.setString(2, tourist.getEmail());
            pst.setString(3, tourist.getPhone());
            pst.setString(4, tourist.getCity());

            pst.executeUpdate();

            System.out.println("Tourist Added Successfully!");

        } catch (Exception e) {

            e.printStackTrace();

        }
    }
}
