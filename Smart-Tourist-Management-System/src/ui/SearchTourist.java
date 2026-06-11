package ui;

import db.DBConnection;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class SearchTourist extends JFrame {

    JTextField searchField;
    JButton searchButton;

    JTable table;

    DefaultTableModel model;

    public SearchTourist() {

        setTitle("Search Tourist");

        setSize(800, 500);

        setLocationRelativeTo(null);

        setLayout(new BorderLayout());

        JPanel topPanel = new JPanel();

        searchField = new JTextField(20);

        searchButton = new JButton("Search");

        topPanel.add(new JLabel("Tourist Name"));

        topPanel.add(searchField);

        topPanel.add(searchButton);

        add(topPanel, BorderLayout.NORTH);

        String[] columns = {
                "ID",
                "Name",
                "Email",
                "Phone",
                "City"
        };

        model =
                new DefaultTableModel(columns, 0);

        table = new JTable(model);

        add(
                new JScrollPane(table),
                BorderLayout.CENTER
        );

        searchButton.addActionListener(
                e -> searchTourist()
        );

        setVisible(true);
    }

    private void searchTourist() {

        model.setRowCount(0);

        try {

            Connection conn =
                    DBConnection.getConnection();

            String sql =
                    "SELECT * FROM tourists WHERE name LIKE ?";

            PreparedStatement pst =
                    conn.prepareStatement(sql);

            pst.setString(
                    1,
                    "%" + searchField.getText() + "%"
            );

            ResultSet rs =
                    pst.executeQuery();

            while(rs.next()) {

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

        } catch(Exception e) {

            e.printStackTrace();

        }
    }
}