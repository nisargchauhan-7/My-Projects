package ui;

import db.DBConnection;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;

public class ViewBookings extends JFrame {

    JTable table;

    public ViewBookings() {

        setTitle("All Bookings");

        setSize(800, 400);

        setLocationRelativeTo(null);

        String[] columns = {
                "Booking ID",
                "Tourist ID",
                "Hotel ID",
                "Check In",
                "Check Out"
        };

        DefaultTableModel model =
                new DefaultTableModel(columns, 0);

        table = new JTable(model);

        try {

            Connection conn =
                    DBConnection.getConnection();

            Statement st =
                    conn.createStatement();

            ResultSet rs =
                    st.executeQuery(
                            "SELECT * FROM bookings"
                    );

            while (rs.next()) {

                model.addRow(
                        new Object[]{
                                rs.getInt("booking_id"),
                                rs.getInt("tourist_id"),
                                rs.getInt("hotel_id"),
                                rs.getDate("check_in"),
                                rs.getDate("check_out")
                        }
                );
            }

        } catch (Exception e) {

            e.printStackTrace();

        }

        add(new JScrollPane(table));

        setVisible(true);
    }
}