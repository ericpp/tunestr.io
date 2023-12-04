import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { Button as AlbyZapsButton } from "@getalby/bitcoin-connect-react";
import { hexToBech32, unwrap } from "@snort/shared";

import { useLogin } from "@/hooks/login";
import Copy from "@/element/copy";
import { NostrProviderDialog } from "@/element/nostr-provider-dialog";
import { useStreamProvider } from "@/hooks/stream-provider";

const enum Tab {
  Account,
  Notifications
}

export function SettingsPage() {
  const navigate = useNavigate();
  const login = useLogin();
  const [tab, setTab] = useState(Tab.Account);
  const providers = useStreamProvider();

  useEffect(() => {
    if (!login) {
      navigate("/");
    }
  }, [login]);

  function tabContent() {
    switch (tab) {
      case Tab.Account: {
        return (
          <>
            <h1>
              <FormattedMessage defaultMessage="Account" id="TwyMau" />
            </h1>
            {login?.pubkey && (
              <div className="public-key">
                <p>
                  <FormattedMessage defaultMessage="Logged in as" id="DZKuuP" />
                </p>
                <Copy text={hexToBech32("npub", login.pubkey)} />
              </div>
            )}
            {login?.privateKey && (
              <div className="private-key">
                <p>
                  <FormattedMessage defaultMessage="Private key" id="Bep/gA" />
                </p>
                <Copy text={hexToBech32("nsec", login.privateKey)} />
              </div>
            )}
            <h1>
              <FormattedMessage defaultMessage="Zaps" id="OEW7yJ" />
            </h1>
            <AlbyZapsButton />
            <h1>
              <FormattedMessage defaultMessage="Stream Key" id="LknBsU" />
            </h1>
            <NostrProviderDialog provider={unwrap(providers.find(a => a.name === "zap.stream"))} showEndpoints={true} showEditor={false} />
          </>
        );
      }
    }
  }

  function tabName(t: Tab) {
    switch (t) {
      case Tab.Account:
        return <FormattedMessage defaultMessage="Account" id="TwyMau" />;
    }
  }

  return (
    <div className="rounded-2xl p-3 md:w-[700px] mx-auto w-full">
      <div className="flex flex-col gap-2">
        <h1>
          <FormattedMessage defaultMessage="Settings" id="D3idYv" />
        </h1>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            {[Tab.Account].map(t => (
              <button onClick={() => setTab(t)} className="rounded-xl px-3 py-2 bg-gray-2 hover:bg-gray-1">
                {tabName(t)}
              </button>
            ))}
          </div>
          <div className="p-5 bg-gray-2 rounded-3xl flex flex-col gap-3">{tabContent()}</div>
        </div>
      </div>
    </div>
  );
}
