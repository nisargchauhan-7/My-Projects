package ui;

import db.DBConnection;

import javax.swing.*;
import java.awt.*;
import java.sql.Connection;
import java.sql.PreparedStatement;

public class DeleteBooking extends JFrame {

    JTextField idField;
    JButton deleteButton;

    public DeleteBooking() {

        setTitle("Delete Booking");

        setSize(400, 200);

        setLocationRelativeTo(null);

        setLayout(new GridLayout(2, 2, 10, 10));

        add(new JLabel("Booking ID"));

        idField = new JTextField();

        add(idField);

        deleteButton =
                new JButton("Delete Booking");

        add(deleteButton);

        deleteButton.addActionListener(
                e -> deleteBooking()
        );

        setVisible(true);
    }

    private void deleteBooking() {

        try {

            Connection conn =
                    DBConnection.getConnection();

            String sql =
                    "DELETE FROM bookings WHERE booking_id=?";

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
                        "Booking Deleted Successfully!"
                );

            } else {

                JOptionPane.showMessageDialog(
                        this,
                        "Booking Not Found!"
                );
            }

        } catch(Exception e) {

            e.printStackTrace();
        }
    }
}