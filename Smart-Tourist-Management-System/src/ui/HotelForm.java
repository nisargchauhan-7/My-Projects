package ui;

import db.HotelDAO;
import model.Hotel;

import javax.swing.*;
import java.awt.*;

public class HotelForm extends JFrame {

    JTextField nameField;
    JTextField locationField;
    JTextField priceField;

    JButton saveButton;

    public HotelForm() {

        setTitle("Add Hotel");

        setSize(400,300);

        setLocationRelativeTo(null);

        setLayout(new GridLayout(4,2,10,10));

        add(new JLabel("Hotel Name"));
        nameField = new JTextField();
        add(nameField);

        add(new JLabel("Location"));
        locationField = new JTextField();
        add(locationField);

        add(new JLabel("Price"));
        priceField = new JTextField();
        add(priceField);

        saveButton = new JButton("Save Hotel");
        add(saveButton);

        saveButton.addActionListener(e -> saveHotel());

        setVisible(true);
    }

    private void saveHotel() {

        Hotel hotel = new Hotel(
                nameField.getText(),
                locationField.getText(),
                Double.parseDouble(priceField.getText())
        );

        HotelDAO.addHotel(hotel);

        JOptionPane.showMessageDialog(
                this,
                "Hotel Saved Successfully!"
        );

        nameField.setText("");
        locationField.setText("");
        priceField.setText("");
    }
}