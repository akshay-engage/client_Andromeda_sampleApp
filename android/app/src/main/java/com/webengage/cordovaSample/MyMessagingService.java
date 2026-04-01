package com.oneandro.client;
import android.util.Log;
import androidx.annotation.NonNull;
import com.capacitorjs.plugins.pushnotifications.MessagingService;
import com.google.firebase.messaging.RemoteMessage;
import com.webengage.sdk.android.WebEngage;
import java.util.Map;

public class MyMessagingService extends MessagingService {
    private static final String TAG = "custom-fcm-service";

    static boolean includesWebEngage() {
        try {
            Class.forName("com.webengage.sdk.android.WebEngage");
            return true;
        } catch (ClassNotFoundException e) {
            Log.e(TAG, "WebEngage Not Found", e);
        } catch (Throwable t) {
            Log.e(TAG, "Error while checking for WebEngage", t);
        }
        return false;
    }

    @Override
    public void onMessageReceived(@NonNull RemoteMessage remoteMessage) {
        super.onMessageReceived(remoteMessage);
        Map<String, String> data = remoteMessage.getData();
        if (data != null && includesWebEngage()) {
            WebEngage.engage(getApplicationContext());
            if ("webengage".equals(data.get("source"))) {
                WebEngage.get().receive(data);
            }
        }
    }

    @Override
    public void onNewToken(@NonNull String s) {
        super.onNewToken(s);
        if (includesWebEngage()) {
            WebEngage.get().setRegistrationID(s);
        }
    }
}
