package db;

import model.Booking;

import java.sql.Connection;
import java.sql.PreparedStatement;

public class BookingDAO {

    public static void addBooking(
            Booking booking
    ) {

        try {

            Connection conn =
                    DBConnection.getConnection();

            String sql =
                    "INSERT INTO bookings(tourist_id,hotel_id,check_in,check_out) VALUES(?,?,?,?)";

            PreparedStatement pst =
                    conn.prepareStatement(sql);

            pst.setInt(1, booking.getTouristId());
            pst.setInt(2, booking.getHotelId());
            pst.setString(3, booking.getCheckIn());
            pst.setString(4, booking.getCheckOut());

            pst.executeUpdate();

            System.out.println(
                    "Booking Added Successfully!"
            );

        } catch(Exception e) {

            e.printStackTrace();

        }
    }
}