import { Fake } from './fake.spec';

export class FakeWalletConnect implements Fake {
    private readonly approveSessionResponse;
    private readonly connectedResponse;
    private readonly createSessionResponse;
    private readonly sessionResponse;
    private readonly onResponse;
    private readonly offResponse;
    private readonly killSessionResponse;
    private readonly approveRequestResponse;
    private readonly rejectRequestResponse;
    private spy;

    constructor(
        approveSessionResponse = null,
        connectedResponse = null,
        createSessionResponse = null,
        sessionResponse = null,
        onResponse = null,
        offResponse = null,
        killSessionResponse = null,
        approveRequestResponse = null,
        rejectRequestResponse = null
    ) {
        this.approveSessionResponse = approveSessionResponse;
        this.connectedResponse = connectedResponse;
        this.createSessionResponse = createSessionResponse;
        this.sessionResponse = sessionResponse;
        this.onResponse = onResponse;
        this.offResponse = offResponse;
        this.killSessionResponse = killSessionResponse;
        this.approveRequestResponse = approveRequestResponse;
        this.rejectRequestResponse = rejectRequestResponse;

    }

    createSpy(): any {
        this.spy = jasmine.createSpyObj('WalletConnect', ['approveSession', 'connected', 'createSession', 'session', 'on', 'off', 'killSession', 'approveRequest', 'rejectRequest']);
        this.modifyReturns(
            this.approveSessionResponse,
            this.connectedResponse,
            this.createSessionResponse,
            this.sessionResponse,
            this.onResponse,
            this.offResponse,
            this.killSessionResponse,
            this.approveRequestResponse,
            this.rejectRequestResponse
        );
        return this.spy;
    }

    modifyReturns(
        approveSessionResponse, 
        connectedResponse, 
        createSessionResponse, 
        sessionResponse, 
        onResponse,
        offResponse,
        killSessionResponse,
        approveRequestResponse,
        rejectRequestResponse
    ) {
        this.spy.approveSession.and.returnValue(Promise.resolve(approveSessionResponse));
        this.spy.connected.and.returnValue(Promise.resolve(connectedResponse));
        this.spy.createSession.and.returnValue(Promise.resolve(createSessionResponse));
        this.spy.session.and.returnValue(Promise.resolve(sessionResponse));
        this.spy.on.and.returnValue(Promise.resolve(onResponse));
        this.spy.off.and.returnValue(Promise.resolve(offResponse));
        this.spy.killSession.and.returnValue(Promise.resolve(killSessionResponse));
        this.spy.approveRequest.and.returnValue(Promise.resolve(approveRequestResponse));
        this.spy.rejectRequest.and.returnValue(Promise.resolve(rejectRequestResponse));
    }
}