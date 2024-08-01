package com.cocos.game;
import com.cocos.lib.JsbBridgeWrapper;

public class GPReview {
    public static void start(){
        //Original method
        JsbBridgeWrapper jbw = JsbBridgeWrapper.getInstance();
        jbw.addScriptEventListener("requestReviewCall", arg ->{
            System.out.print("@JAVA: here is the argument transport in" + arg);

            // ReviewManager manager = ReviewManagerFactory.create(this);

            ReviewManager manager = new FakeReviewManager(context);

            Task<ReviewInfo> request = manager.requestReviewFlow();
            request.addOnCompleteListener(task -> {
                if (task.isSuccessful()) {
                    // We can get the ReviewInfo object
                    ReviewInfo reviewInfo = task.getResult();
                } else {
                    // There was some problem, log or handle the error code.
                    @ReviewErrorCode int reviewErrorCode = ((ReviewException) task.getException()).getErrorCode();
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