package com.dj.eccom_backend.exception;

public class OutOfStockException extends Exception{
    public OutOfStockException(String message){
        super(message);
    }
}
