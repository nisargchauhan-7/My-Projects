package ui;

import db.DBConnection;

import javax.swing.*;
import java.awt.*;
import java.sql.Connection;
import java.sql.PreparedStatement;

public class DeleteHotel extends JFrame {

    JTextField idField;
    JButton deleteButton;

    public DeleteHotel() {

        setTitle("Delete Hotel");

        setSize(400, 200);

        setLocationRelativeTo(null);

        setLayout(new GridLayout(2, 2, 10, 10));

        add(new JLabel("Hotel ID"));

        idField = new JTextField();

        add(idField);

        deleteButton = new JButton("Delete Hotel");

        add(deleteButton);

        deleteButton.addActionListener(
                e -> deleteHotel()
        );

        setVisible(true);
    }

    private void deleteHotel() {

        try {

            Connection conn =
                    DBConnection.getConnection();

            String sql =
                    "DELETE FROM hotels WHERE hotel_id=?";

            PreparedStatement pst =
                    conn.prepareStatement(sql);

            pst.setInt(
                    1,
                    Integer.parseInt(
                            idField.getText()
                    )
            );

            int rows =
                    pst.executeUpdate();

            if(rows > 0) {

                JOptionPane.showMessageDialog(
                        this,
                        "Hotel Deleted Successfully!"
                );

            } else {

                JOptionPane.showMessageDialog(
                        this,
                        "Hotel Not Found!"
                );
            }

        } catch(Exception e) {

            e.printStackTrace();
        }
    }
}