package ui;

import db.DBConnection;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.sql.*;

public class ViewHotels extends JFrame {

    public ViewHotels() {

        setTitle("All Hotels");

        setSize(700,400);

        setLocationRelativeTo(null);

        String[] columns = {
                "ID",
                "Hotel Name",
                "Location",
                "Price"
        };

        DefaultTableModel model =
                new DefaultTableModel(columns,0);

        JTable table = new JTable(model);

        try {

            Connection conn =
                    DBConnection.getConnection();

            Statement st =
                    conn.createStatement();

            ResultSet rs =
                    st.executeQuery(
                            "SELECT * FROM hotels"
                    );

            while(rs.next()) {

                model.addRow(
                        new Object[]{

                                rs.getInt("hotel_id"),
                                rs.getString("hotel_name"),
                                rs.getString("location"),
                                rs.getDouble("price")
                        }
                );
            }

        } catch(Exception e) {

            e.printStackTrace();
        }

        add(new JScrollPane(table));

        setVisible(true);
    }
}