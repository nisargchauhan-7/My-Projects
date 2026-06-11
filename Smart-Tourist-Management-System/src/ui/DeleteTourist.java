package ui;

import db.DBConnection;

import javax.swing.*;
import java.awt.*;
import java.sql.Connection;
import java.sql.PreparedStatement;

public class DeleteTourist extends JFrame {

    JTextField idField;

    JButton deleteButton;

    public DeleteTourist() {

        setTitle("Delete Tourist");

        setSize(400,200);

        setLocationRelativeTo(null);

        setLayout(new GridLayout(2,2,10,10));

        add(new JLabel("Tourist ID"));

        idField = new JTextField();

        add(idField);

        deleteButton =
                new JButton("Delete Tourist");

        add(deleteButton);

        deleteButton.addActionListener(
                e -> deleteTourist()
        );

        setVisible(true);
    }

    private void deleteTourist() {

        try {

            Connection conn =
                    DBConnection.getConnection();

            String sql =
                    "DELETE FROM tourists WHERE tourist_id=?";

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
                        "Tourist Deleted Successfully!"
                );

            } else {

                JOptionPane.showMessageDialog(
                        this,
                        "Tourist Not Found!"
                );
            }

        } catch(Exception e) {

            e.printStackTrace();
        }
    }
}