package com.cocos.game;
import com.cocos.lib.JsbBridgeWrapper;

import android.os.Bundle;
import com.google.android.play.core.review.ReviewInfo;
import com.google.android.play.core.review.ReviewManager;
import com.google.android.play.core.review.ReviewManagerFactory;
import com.google.android.play.core.review.model.ReviewErrorCode;
import com.google.android.play.core.review.ReviewException;
import android.content.Context;
import com.google.android.gms.tasks.Task;

public class GPReview {
    public void start(Context context){

        ReviewManager manager = ReviewManagerFactory.create(context);

        //Original method
        JsbBridgeWrapper jbw = JsbBridgeWrapper.getInstance();
        jbw.addScriptEventListener("requestReviewCall", arg ->{
            System.out.print("@JAVA: here is the argument transport in" + arg);

            Task<ReviewInfo> request = manager.requestReviewFlow();
            request.addOnCompleteListener(task -> {
                if (task.isSuccessful()) {
                    // We can get the ReviewInfo object
                    ReviewInfo reviewInfo = task.getResult();
                } else {
                    // There was some problem, log or handle the error code.

                    @ReviewErrorCode int reviewErrorCode = ((ReviewException) task.getException()).getErrorCode();
                    System.out.print("Review error: "+ reviewErrorCode);
                    // @ReviewErrorCode int reviewErrorCode = ((ReviewException) task.getException()).getErrorCode();
                }
            });

            // jbw.dispatchEventToScript("changeLabelContent","Charlotte");
        });
      
        //Only use JavaEventHandler
        jbw.addScriptEventListener("removeJSCallback", arg->{
            jbw.removeAllListenersForEvent("requestReviewCall");
        });
    }


}