package model;

public class Hotel {

    private String hotelName;
    private String location;
    private double price;

    public Hotel(String hotelName, String location, double price) {
        this.hotelName = hotelName;
        this.location = location;
        this.price = price;
    }

    public String getHotelName() {
        return hotelName;
    }

    public String getLocation() {
        return location;
    }

    public double getPrice() {
        return price;
    }
}