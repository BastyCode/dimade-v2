package cl.dimade.auth.auth;

public class AuthenticationResponse {
    private String accessToken;
    private String refreshToken;
    private boolean needsPasswordChange;

    public AuthenticationResponse() {}

    public AuthenticationResponse(String accessToken, String refreshToken) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }

    public AuthenticationResponse(String accessToken, String refreshToken, boolean needsPasswordChange) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.needsPasswordChange = needsPasswordChange;
    }

    public String getAccessToken() { return accessToken; }
    public void setAccessToken(String accessToken) { this.accessToken = accessToken; }

    public String getRefreshToken() { return refreshToken; }
    public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }

    public boolean isNeedsPasswordChange() { return needsPasswordChange; }
    public void setNeedsPasswordChange(boolean needsPasswordChange) { this.needsPasswordChange = needsPasswordChange; }
}
