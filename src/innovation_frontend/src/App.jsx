import React, { useState } from 'react';
import { Actor, HttpAgent } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';

const webapp_id = process.env.WHOAMI_CANISTER_ID;

const webapp_idl = ({ IDL }) => {
    return IDL.Service({ whoami: IDL.Func([], [IDL.Principal], ['query']) });
};

function App() {
    const [principal, setPrincipal] = useState('');
    const [iiUrl, setIiUrl] = useState('');

    React.useEffect(() => {
        const url = process.env.DFX_NETWORK === 'local'
            ? `http://localhost:4943/?canisterId=${process.env.II_CANISTER_ID}`
            : `https://${process.env.II_CANISTER_ID}.ic0.app`;

        setIiUrl(url);
    }, []);

    const handleLogin = async () => {
        const authClient = await AuthClient.create();

        await new Promise((resolve, reject) => {
            authClient.login({
                identityProvider: iiUrl,
                onSuccess: resolve,
                onError: reject,
            });
        });

        const identity = authClient.getIdentity();
        const agent = new HttpAgent({ identity });
        const webapp = Actor.createActor(webapp_idl, {
            agent,
            canisterId: webapp_id,
        });

        const userPrincipal = await webapp.whoami();
        setPrincipal(userPrincipal.toText());
    };

    return (
        <div>
            <h1>Who Am I?</h1>
            <input id="iiUrl" type="text" value={iiUrl} readOnly />
            <button onClick={handleLogin}>Login with Internet Identity</button>
            <p>Your Principal: {principal}</p>
        </div>
    );
}

export default App;
