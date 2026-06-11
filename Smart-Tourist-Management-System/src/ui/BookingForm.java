package ui;

import db.BookingDAO;
import db.DBConnection;
import model.Booking;

import javax.swing.*;
import java.awt.*;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.HashMap;

public class BookingForm extends JFrame {

    JComboBox<String> touristBox;
    JComboBox<String> hotelBox;

    JTextField checkInField;
    JTextField checkOutField;

    JButton bookBtn;

    HashMap<String,Integer> touristMap =
            new HashMap<>();

    HashMap<String,Integer> hotelMap =
            new HashMap<>();

    public BookingForm() {

        setTitle("Hotel Booking");

        setSize(500,350);

        setLocationRelativeTo(null);

        setLayout(new GridLayout(5,2,10,10));

        add(new JLabel("Tourist"));

        touristBox = new JComboBox<>();
        add(touristBox);

        add(new JLabel("Hotel"));

        hotelBox = new JComboBox<>();
        add(hotelBox);

        add(new JLabel("Check In (YYYY-MM-DD)"));

        checkInField = new JTextField();
        add(checkInField);

        add(new JLabel("Check Out (YYYY-MM-DD)"));

        checkOutField = new JTextField();
        add(checkOutField);

        bookBtn = new JButton("Book Hotel");

        add(bookBtn);

        loadTourists();
        loadHotels();

        bookBtn.addActionListener(
                e -> saveBooking()
        );

        setVisible(true);
    }

    private void loadTourists() {

        try {

            Connection conn =
                    DBConnection.getConnection();

            Statement st =
                    conn.createStatement();

            ResultSet rs =
                    st.executeQuery(
                            "SELECT * FROM tourists"
                    );

            while(rs.next()) {

                int id =
                        rs.getInt("tourist_id");

                String name =
                        rs.getString("name");

                touristMap.put(name,id);

                touristBox.addItem(name);
            }

        } catch(Exception e) {

            e.printStackTrace();
        }
    }

    private void loadHotels() {

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

                int id =
                        rs.getInt("hotel_id");

                String hotel =
                        rs.getString("hotel_name");

                hotelMap.put(hotel,id);

                hotelBox.addItem(hotel);
            }

        } catch(Exception e) {

            e.printStackTrace();
        }
    }

    private void saveBooking() {

        String touristName =
                (String) touristBox.getSelectedItem();

        String hotelName =
                (String) hotelBox.getSelectedItem();

        int touristId =
                touristMap.get(touristName);

        int hotelId =
                hotelMap.get(hotelName);

        Booking booking =
                new Booking(
                        touristId,
                        hotelId,
                        checkInField.getText(),
                        checkOutField.getText()
                );

        BookingDAO.addBooking(booking);

        JOptionPane.showMessageDialog(
                this,
                "Booking Successful!"
        );
    }
}