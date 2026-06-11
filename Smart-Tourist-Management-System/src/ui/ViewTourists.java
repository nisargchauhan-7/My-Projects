package ui;

import db.DBConnection;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;

public class ViewTourists extends JFrame {

    JTable table;

    public ViewTourists() {

        setTitle("All Tourists");

        setSize(700, 400);

        setLocationRelativeTo(null);

        String[] columns = {
                "ID",
                "Name",
                "Email",
                "Phone",
                "City"
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
                            "SELECT * FROM tourists"
                    );

            while (rs.next()) {

                model.addRow(
                        new Object[]{

                                rs.getInt("tourist_id"),
                                rs.getString("name"),
                                rs.getString("email"),
                                rs.getString("phone"),
                                rs.getString("city")
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