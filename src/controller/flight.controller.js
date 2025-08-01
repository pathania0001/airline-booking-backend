const { StatusCodes } = require("http-status-codes");
const Service = require("../services")
const { SuccessResponse, ErrorResponse } = require("../utils/common")


const registerFlight = async(req,res)=>{
     try {
         const flight = await Service.Flight.createFlight({

        flightNumber:req.body.flightNumber,
        airplaneId:req.body.airplaneId,
        departureAirportId:req.body.departureAirportId,
        arrivalAirportId:req.body.arrivalAirportId,
        departureTime:req.body.departureTime,
        arrivalTime:req.body.arrivalTime,
        price:req.body.price,
        totalSeats:req.body.totalSeats,
        boardingGate:req.body.boardingGate,
    })

    SuccessResponse.data = flight;
    return res.status(StatusCodes.OK).json(SuccessResponse);
        
     } catch (error) {
        ErrorResponse.error = error;
        return res.status(error.statusCode).json(ErrorResponse);
     }
 
}

const getFlights = async(req,res)=>{

    try {
    const flights = await Service.Flight.getAllFlights(req.query); 

    SuccessResponse.data = flights;
    return res.status(StatusCodes.OK).json(SuccessResponse);

    } catch (error) {
        ErrorResponse.error = error;
        return res.status(error.statusCode).json(ErrorResponse);
    }
}

module.exports = {
    registerFlight,
    getFlights,
}