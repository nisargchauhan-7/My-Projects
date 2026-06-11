package db;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;

public class DashboardDAO {

    public static int getTouristCount() {

        try {

            Connection conn =
                    DBConnection.getConnection();

            Statement st =
                    conn.createStatement();

            ResultSet rs =
                    st.executeQuery(
                            "SELECT COUNT(*) FROM tourists"
                    );

            if(rs.next()) {

                return rs.getInt(1);

            }

        } catch(Exception e) {

            e.printStackTrace();

        }

        return 0;
    }

    public static int getHotelCount() {

        try {

            Connection conn =
                    DBConnection.getConnection();

            Statement st =
                    conn.createStatement();

            ResultSet rs =
                    st.executeQuery(
                            "SELECT COUNT(*) FROM hotels"
                    );

            if(rs.next()) {

                return rs.getInt(1);

            }

        } catch(Exception e) {

            e.printStackTrace();

        }

        return 0;
    }

    public static int getBookingCount() {

        try {

            Connection conn =
                    DBConnection.getConnection();

            Statement st =
                    conn.createStatement();

            ResultSet rs =
                    st.executeQuery(
                            "SELECT COUNT(*) FROM bookings"
                    );

            if(rs.next()) {

                return rs.getInt(1);

            }

        } catch(Exception e) {

            e.printStackTrace();

        }

        return 0;
    }
}