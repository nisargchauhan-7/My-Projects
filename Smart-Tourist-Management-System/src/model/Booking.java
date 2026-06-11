package model;

public class Booking {

    private int touristId;
    private int hotelId;
    private String checkIn;
    private String checkOut;

    public Booking(
            int touristId,
            int hotelId,
            String checkIn,
            String checkOut
    ) {
        this.touristId = touristId;
        this.hotelId = hotelId;
        this.checkIn = checkIn;
        this.checkOut = checkOut;
    }

    public int getTouristId() {
        return touristId;
    }

    public int getHotelId() {
        return hotelId;
    }

    public String getCheckIn() {
        return checkIn;
    }

    public String getCheckOut() {
        return checkOut;
    }
}