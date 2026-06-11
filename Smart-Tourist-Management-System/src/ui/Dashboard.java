package ui;

import db.DashboardDAO;

import javax.swing.*;
import java.awt.*;

public class Dashboard extends JFrame {

    JButton addTouristBtn;
    JButton viewTouristsBtn;
    JButton searchTouristBtn;
    JButton deleteTouristBtn;

    JButton addHotelBtn;
    JButton viewHotelsBtn;
    JButton deleteHotelBtn;

    JButton addBookingBtn;
    JButton viewBookingsBtn;
    JButton deleteBookingBtn;

    JButton exitBtn;

    JLabel touristCountLabel;
    JLabel hotelCountLabel;
    JLabel bookingCountLabel;

    public Dashboard() {

        setTitle("Smart Tourist Management System");
        setSize(1400, 900);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);

        setLayout(new BorderLayout());

        JPanel sidebar = new JPanel();

        sidebar.setLayout(
                new GridLayout(
                        6,
                        1,
                        10,
                        10
                )
        );

        sidebar.setBackground(
                new Color(
                        44,
                        62,
                        80
                )
        );

        sidebar.setPreferredSize(
                new Dimension(
                        220,
                        0
                )
        );

        // =========================
        // COLOR VARAIBLE HERE
        // =========================

        Color touristColor =
                new Color(52,152,219);

        Color hotelColor =
                new Color(46,204,113);

        Color bookingColor =
                new Color(230,126,34);

        // =========================
        // TITLE
        // =========================

        JLabel title = new JLabel(
                "SMART TOURIST MANAGEMENT SYSTEM",
                JLabel.CENTER
        );

        title.setFont(
                new Font(
                        "Segoe UI",
                        Font.BOLD,
                        36
                )
        );

        title.setForeground(
                new Color(
                        44,
                        62,
                        80
                        )
        );

        title.setFont(
                new Font(
                        "Arial",
                        Font.BOLD,
                        32
                )
        );

        // =========================
        // STATISTICS PANEL
        // =========================

        JPanel statsPanel = new JPanel();

        statsPanel.setLayout(
                new GridLayout(
                        1,
                        3,
                        20,
                        0
                )
        );

        // TOURIST CARD

        JPanel touristCard = new JPanel();

        touristCard.setBackground(touristColor);

        touristCard.setBorder(
                BorderFactory.createLineBorder(
                        Color.WHITE,
                        2
                )
        );

        touristCard.setLayout(
                new BorderLayout()
        );

        JLabel touristTitle =
                new JLabel(
                        "TOURISTS",
                        JLabel.CENTER
        );

        touristTitle.setForeground(Color.WHITE);

        touristTitle.setFont(
                new Font(
                        "Segoe UI",
                        Font.BOLD,
                        20
                )
        );

        JLabel touristCount =
                new JLabel(
                        String.valueOf(
                                DashboardDAO.getTouristCount()
                        ),
                        JLabel.CENTER
                );

        touristCount.setForeground(Color.WHITE);

        touristCount.setFont(
                new Font(
                        "Segoe UI",
                        Font.BOLD,
                        50
                )
        );

        touristCard.add(
                touristTitle,
                BorderLayout.NORTH
        );

        touristCard.add(
                touristCount,
                BorderLayout.CENTER
        );

        // HOTEL CARD

        JPanel hotelCard = new JPanel();

        hotelCard.setBackground(hotelColor);

        hotelCard.setLayout(
                new BorderLayout()
        );

        hotelCard.setBorder(
                BorderFactory.createLineBorder(
                        Color.WHITE,
                        2
                )
        );

        JLabel hotelTitle =
                new JLabel(
                        "HOTELS",
                        JLabel.CENTER
        );

        hotelTitle.setForeground(Color.WHITE);

        hotelTitle.setFont(
                new Font(
                        "Segoe UI",
                        Font.BOLD,
                        20
                )
        );

        JLabel hotelCount =
                new JLabel(
                        String.valueOf(
                                DashboardDAO.getHotelCount()
                        ),
                        JLabel.CENTER
                );

        hotelCount.setForeground(Color.WHITE);

        hotelCount.setFont(
                new Font(
                        "Segoe UI",
                        Font.BOLD,
                        50
                )
        );

        hotelCard.add(
                hotelTitle,
                BorderLayout.NORTH
        );

        hotelCard.add(
                hotelCount,
                BorderLayout.CENTER
        );

        // BOOKING CARD

        JPanel bookingCard = new JPanel();

        bookingCard.setBackground(bookingColor);

        bookingCard.setLayout(
                new BorderLayout()
        );

        bookingCard.setBorder(
                BorderFactory.createLineBorder(
                        Color.WHITE,
                        2
                )
        );

        JLabel bookingTitle =
                new JLabel(
                        "BOOKINGS",
                        JLabel.CENTER
        );

        bookingTitle.setForeground(Color.WHITE);

        bookingTitle.setFont(
                new Font(
                        "Segoe UI",
                        Font.BOLD,
                        20
                )
        );

        JLabel bookingCount =
                new JLabel(
                        String.valueOf(
                                DashboardDAO.getBookingCount()
                        ),
                        JLabel.CENTER
                );

        bookingCount.setForeground(Color.WHITE);

        bookingCount.setFont(
                new Font(
                        "Segoe UI",
                        Font.BOLD,
                        50
                )
        );

        bookingCard.add(
                bookingTitle,
                BorderLayout.NORTH
        );

        bookingCard.add(
                bookingCount,
                BorderLayout.CENTER
        );

        statsPanel.add(touristCard);
        statsPanel.add(hotelCard);
        statsPanel.add(bookingCard);

        // =========================
        // TOP PANEL
        // =========================

        JPanel topPanel =
                new JPanel(
                        new BorderLayout()
                );

        topPanel.setBorder(
                BorderFactory.createEmptyBorder(
                        35,
                        20,
                        20,
                        20
                )
        );

        topPanel.add(
                title,
                BorderLayout.NORTH
        );

        topPanel.add(
                statsPanel,
                BorderLayout.CENTER
        );

        JButton dashboardBtn =
                new JButton("Dashboard");

        JButton touristBtn =
                new JButton("Tourists");

        JButton hotelBtn =
                new JButton("Hotels");

        JButton bookingBtn =
                new JButton("Bookings");

        JButton logoutBtn =
                new JButton("Logout");

        Font sideFont =
                new Font(
                        "Segoe UI",
                        Font.BOLD,
                        18
        );

        JButton[] sideButtons = {

                dashboardBtn,
                touristBtn,
                hotelBtn,
                bookingBtn,
                logoutBtn
        };

        for (JButton btn : sideButtons) {

                btn.setFont(sideFont);

                btn.setForeground(Color.WHITE);

                btn.setBackground(
                        new Color(
                                44,
                                62,
                                80
                        )
                );

                btn.setBorderPainted(false);

                btn.setFocusPainted(false);

                btn.setCursor(
                        new Cursor(
                                Cursor.HAND_CURSOR
                        )
                );
        }

        sidebar.add(dashboardBtn);
        sidebar.add(touristBtn);
        sidebar.add(hotelBtn);
        sidebar.add(bookingBtn);
        sidebar.add(logoutBtn);

        dashboardBtn.setText("Dashboard");
        touristBtn.setText("Tourists");
        hotelBtn.setText("Hotels");
        bookingBtn.setText("Bookings");
        logoutBtn.setText("Logout");

        dashboardBtn.setForeground(Color.WHITE);
        touristBtn.setForeground(Color.WHITE);
        hotelBtn.setForeground(Color.WHITE);
        bookingBtn.setForeground(Color.WHITE);
        logoutBtn.setForeground(Color.WHITE);

        // =========================
        // BUTTON PANEL
        // =========================

        JPanel panel = new JPanel();

        panel.setLayout(
                new GridLayout(
                        6,
                        2,
                        25,
                        25
                )
        );

        addTouristBtn =
                new JButton(
                        "Add Tourist"
                );

        viewTouristsBtn =
                new JButton(
                        "View Tourists"
                );

        searchTouristBtn =
                new JButton(
                        "Search Tourist"
                );

        deleteTouristBtn =
                new JButton(
                        "Delete Tourist"
                );

        addHotelBtn =
                new JButton(
                        "Add Hotel"
                );

        viewHotelsBtn =
                new JButton(
                        "View Hotels"
                );

        deleteHotelBtn =
                new JButton(
                        "Delete Hotel"

                );

        addBookingBtn =
                new JButton(
                        "Add Booking"
                );

        viewBookingsBtn =
                new JButton(
                        "View Bookings"
                );

        deleteBookingBtn = 
                new JButton(
                        "Delete Booking"
                );

        exitBtn =
                new JButton(
                        "Exit"
                );

        Font buttonFont =
                new Font(
                        "Segoe UI",
                        Font.BOLD,
                        20
        );

        Dimension btnSize =
                        new Dimension(
                        300,
                        70
        );

        addTouristBtn.setFont(buttonFont);
        addTouristBtn.setPreferredSize(btnSize);

        viewTouristsBtn.setFont(buttonFont);
        viewTouristsBtn.setPreferredSize(btnSize);

        searchTouristBtn.setFont(buttonFont);
        searchTouristBtn.setPreferredSize(btnSize);

        deleteTouristBtn.setFont(buttonFont);
        deleteTouristBtn.setPreferredSize(btnSize);

        addHotelBtn.setFont(buttonFont);
        addHotelBtn.setPreferredSize(btnSize);

        viewHotelsBtn.setFont(buttonFont);
        viewHotelsBtn.setPreferredSize(btnSize);

        deleteHotelBtn.setFont(buttonFont);
        deleteHotelBtn.setPreferredSize(btnSize);

        addBookingBtn.setFont(buttonFont);
        addBookingBtn.setPreferredSize(btnSize);

        viewBookingsBtn.setFont(buttonFont);
        viewBookingsBtn.setPreferredSize(btnSize);

        deleteBookingBtn.setFont(buttonFont);
        deleteBookingBtn.setPreferredSize(btnSize);

        exitBtn.setFont(buttonFont);
        exitBtn.setPreferredSize(
                new Dimension(
                        0,
                        90
                )
        );

        panel.add(addTouristBtn);
        panel.add(viewTouristsBtn);
        panel.add(searchTouristBtn);
        panel.add(deleteTouristBtn);

        panel.add(addHotelBtn);
        panel.add(viewHotelsBtn);
        panel.add(deleteHotelBtn);

        panel.add(addBookingBtn);
        panel.add(viewBookingsBtn);
        panel.add(deleteBookingBtn);

        panel.add(exitBtn);

        panel.setBorder(
                BorderFactory.createEmptyBorder(
                        30,
                        30,
                        30,
                        30
                )
        );

        JPanel buttonPanel = new JPanel(
                new GridLayout(5, 2, 20, 20)
        );

        buttonPanel.add(addTouristBtn);
        buttonPanel.add(viewTouristsBtn);

        buttonPanel.add(searchTouristBtn);
        buttonPanel.add(deleteTouristBtn);

        buttonPanel.add(addHotelBtn);
        buttonPanel.add(viewHotelsBtn);

        buttonPanel.add(deleteHotelBtn);
        buttonPanel.add(addBookingBtn);

        buttonPanel.add(viewBookingsBtn);
        buttonPanel.add(deleteBookingBtn);

        JPanel bottomPanel = new JPanel(
                new BorderLayout()
        );

        bottomPanel.add(
                buttonPanel,
                BorderLayout.CENTER
        );

        bottomPanel.add(
                exitBtn,
                BorderLayout.SOUTH
        );

        JPanel contentPanel =
                new JPanel(
                        new BorderLayout(
                                20,
                                20
                        )
                );

        contentPanel.add(
                topPanel,
                BorderLayout.NORTH
        );

        contentPanel.add(
                bottomPanel,
                BorderLayout.CENTER
        );

        // =========================
        // BUTTON EVENTS
        // =========================

        addTouristBtn.addActionListener(
                e -> new TouristForm()
        );

        viewTouristsBtn.addActionListener(
                e -> new ViewTourists()
        );

        searchTouristBtn.addActionListener(
                e -> new SearchTourist()
        );

        deleteTouristBtn.addActionListener(
                e -> new DeleteTourist()
        );

        addHotelBtn.addActionListener(
                e -> new HotelForm()
        );

        viewHotelsBtn.addActionListener(
                e -> new ViewHotels()
        );

        deleteHotelBtn.addActionListener(
                e -> new DeleteHotel()
        );

        addBookingBtn.addActionListener(
                e -> new BookingForm()
        );

        viewBookingsBtn.addActionListener(
                e -> new ViewBookings()
        );

        deleteBookingBtn.addActionListener(
                e -> new DeleteBooking()
        );

        exitBtn.addActionListener(
                e -> System.exit(0)
        );

        add(
                sidebar,
                BorderLayout.WEST
        );

        add(
                contentPanel,
                BorderLayout.CENTER
        );

        logoutBtn.addActionListener(e -> {

                dispose();

                new LoginForm();

        });

        setVisible(true);
    }
}