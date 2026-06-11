package ui;

import javax.swing.*;
import java.awt.*;

public class LoginForm extends JFrame {

    JTextField usernameField;
    JPasswordField passwordField;

    public LoginForm() {

        setTitle("Login");
        setSize(450, 300);
        setLocationRelativeTo(null);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

        JPanel panel = new JPanel();
        panel.setLayout(null);

        JLabel title = new JLabel("Smart Tourist Management System");
        title.setBounds(40, 20, 350, 30);
        title.setFont(new Font("Arial", Font.BOLD, 20));

        JLabel userLabel = new JLabel("Username:");
        userLabel.setBounds(50, 80, 100, 25);

        usernameField = new JTextField();
        usernameField.setBounds(150, 80, 200, 25);

        JLabel passLabel = new JLabel("Password:");
        passLabel.setBounds(50, 130, 100, 25);

        passwordField = new JPasswordField();
        passwordField.setBounds(150, 130, 200, 25);

        JButton loginBtn = new JButton("Login");
        loginBtn.setBounds(150, 190, 120, 35);

        loginBtn.addActionListener(e -> login());

        panel.add(title);
        panel.add(userLabel);
        panel.add(usernameField);
        panel.add(passLabel);
        panel.add(passwordField);
        panel.add(loginBtn);

        add(panel);

        setVisible(true);
    }

    private void login() {

        String username = usernameField.getText();
        String password = new String(passwordField.getPassword());

        if(username.equals("admin") &&
           password.equals("admin123"))
        {
            JOptionPane.showMessageDialog(this,
                    "Login Successful");

            dispose();

            new Dashboard();
        }
        else
        {
            JOptionPane.showMessageDialog(this,
                    "Invalid Username or Password");
        }
    }
}