package ui;

import db.TouristDAO;
import model.Tourist;

import javax.swing.*;
import java.awt.*;

public class TouristForm extends JFrame {

    JTextField nameField;
    JTextField emailField;
    JTextField phoneField;
    JTextField cityField;

    JButton saveButton;

    public TouristForm() {

        setTitle("Smart Tourist Management System");
        setSize(400, 300);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);

        setLayout(new GridLayout(5, 2, 10, 10));

        add(new JLabel("Name"));
        nameField = new JTextField();
        add(nameField);

        add(new JLabel("Email"));
        emailField = new JTextField();
        add(emailField);

        add(new JLabel("Phone"));
        phoneField = new JTextField();
        add(phoneField);

        add(new JLabel("City"));
        cityField = new JTextField();
        add(cityField);

        saveButton = new JButton("Save Tourist");
        add(saveButton);

        saveButton.addActionListener(e -> saveTourist());

        setVisible(true);
    }

    private void saveTourist() {

        String name = nameField.getText();
        String email = emailField.getText();
        String phone = phoneField.getText();
        String city = cityField.getText();

        Tourist tourist =
                new Tourist(name, email, phone, city);

        TouristDAO.addTourist(tourist);

        JOptionPane.showMessageDialog(
                this,
                "Tourist Saved Successfully!"
        );

        nameField.setText("");
        emailField.setText("");
        phoneField.setText("");
        cityField.setText("");
    }
}