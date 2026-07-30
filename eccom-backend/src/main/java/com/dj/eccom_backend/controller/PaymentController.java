package com.dj.eccom_backend.controller;

import java.util.UUID;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.dj.eccom_backend.model.dto.PaymentRequestDTO;
import com.dj.eccom_backend.model.dto.PaymentVerificationRequest;
import com.dj.eccom_backend.service.OrderService;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/payment")
@RequiredArgsConstructor
public class PaymentController {

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    private final OrderService orderService;

    @PostMapping(value = "/create-order", produces = "application/json")
    public ResponseEntity<?> createRazorpayOrder(@RequestBody PaymentRequestDTO request) throws RazorpayException{

        RazorpayClient rayzorpay = new RazorpayClient(keyId, keySecret);

        JSONObject orderRequest = new JSONObject();

        int amountInPaise = (int) (request.amount() * 100);

        orderRequest.put("amount", amountInPaise);
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", "txn_" + UUID.randomUUID().toString());

        Order order = rayzorpay.orders.create(orderRequest);

        return ResponseEntity.ok(order.toString());
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyAndCreateOrder(
            @RequestBody PaymentVerificationRequest request,
            @AuthenticationPrincipal Jwt jwt) throws RazorpayException {
        
        JSONObject options = new JSONObject();
        options.put("razorpay_order_id", request.razorpayOrderId());
        options.put("razorpay_payment_id",request.razorpayPaymentId());
        options.put("razorpay_signature",request.razorpaySignature());

        boolean isSignatureValid = Utils.verifyPaymentSignature(options, keySecret);

        if(!isSignatureValid){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Payment veification failed");
        }

       com.dj.eccom_backend.model.Order order =
                orderService.createOrder(request.orderRequest(), jwt.getSubject());

        return ResponseEntity.ok("Order placed sucessfully! ID : " + order.getId());
    }

}
