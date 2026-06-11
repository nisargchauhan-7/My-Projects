package db;

import model.Hotel;
import java.sql.Connection;
import java.sql.PreparedStatement;

public class HotelDAO {

    public static void addHotel(Hotel hotel) {

        try {

            Connection conn = DBConnection.getConnection();

            String sql =
                    "INSERT INTO hotels(hotel_name,location,price) VALUES(?,?,?)";

            PreparedStatement pst =
                    conn.prepareStatement(sql);

            pst.setString(1, hotel.getHotelName());
            pst.setString(2, hotel.getLocation());
            pst.setDouble(3, hotel.getPrice());

            pst.executeUpdate();

            System.out.println("Hotel Added Successfully!");

        } catch (Exception e) {

            e.printStackTrace();
        }
    }
}