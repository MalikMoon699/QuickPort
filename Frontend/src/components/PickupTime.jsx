import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const PickupTime = ({
  setPickupSelectionModel,
  setPickupSelection,
  pickupSelection,
  setPickupTime,
  pickupTime,
  setPickupDate,
  pickupDate,
}) => {
  const handleClose = () => {
    setPickupSelectionModel(false);
    setPickupSelection("");
  };

  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = Math.floor(now.getMinutes() / 10) * 10; 

  return (
    <div onClick={handleClose} className="modal-overlay">
      <div onClick={(e) => e.stopPropagation()} className="modal-content">
        {pickupSelection === "date" ? (
          <Calendar
            value={
              pickupDate && !isNaN(new Date(pickupDate).getTime())
                ? new Date(pickupDate)
                : new Date()
            }
            onChange={(date) => {
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, "0");
              const day = String(date.getDate()).padStart(2, "0");
              setPickupDate(`${year}-${month}-${day}`);
              setPickupTime(`${currentHour}:${currentMinute}`);
              handleClose();
            }}
            minDate={
              new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            }
            maxDate={
              new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
            }
          />
        ) : (
          <select
            className="time-picker"
            value={pickupTime}
            onChange={(e) => {
              setPickupTime(e.target.value);
              handleClose();
            }}
          >
            <option value="now">Now</option>

            {Array.from({ length: 24 }).map((_, h) =>
              Array.from({ length: 6 }).map((_, m) => {
                const hour = String(h).padStart(2, "0");
                const minute = String(m * 10).padStart(2, "0");
                const time = `${hour}:${minute}`;

                if (
                  h < currentHour ||
                  (h === currentHour && m * 10 < currentMinute)
                ) {
                  return null;
                }

                return (
                  <option key={time} value={time}>
                    {time}
                  </option>
                );
              })
            )}
          </select>
        )}
      </div>
    </div>
  );
};

export default PickupTime;
