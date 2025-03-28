import BalanceTimeEstimate from "@/element/balance-time-estimate";
import { DefaultButton } from "@/element/buttons";
import { Icon } from "@/element/icon";
import { useRates } from "@/hooks/rates";
import { DefaultProvider, StreamProviderInfo } from "@/providers";
import { useEffect, useMemo, useState } from "react";
import { FormattedMessage, FormattedNumber } from "react-intl";
import { useNavigate } from "react-router-dom";
import ZapGlow from "../zap-glow";
import { AcceptTos } from "../tos";

export default function DashboardIntro() {
  const navigate = useNavigate();
  const [info, setInfo] = useState<StreamProviderInfo>();
  const [tos, setTos] = useState<boolean>(false);
  const defaultSatsBalance = 1000;
  const exampleHours = 4;

  const defaultEndpoint = useMemo(() => {
    return info?.endpoints?.find(a => a.name == "Best") ?? info?.endpoints?.at(0);
  }, [info]);
  const rate = useRates("BTCUSD");
  const exampleCost = rate.ask * (exampleHours * (defaultEndpoint?.rate ?? 0) * 60) * 1e-8;

  useEffect(() => {
    DefaultProvider.info().then(i => {
      setInfo(i);
      setTos(Boolean(i.tosAccepted));
    });
  }, []);

  if (!defaultEndpoint) return;

  return (
    <div className="flex flex-col gap-4 mx-auto xl:w-1/3 lg:w-1/2 bg-layer-1 rounded-xl border border-layer-2 p-6">
      <h1>
        <FormattedMessage defaultMessage="Welcome to tunestr.io!" />
      </h1>
      <div className="flex gap-4">
        <div>
          <ZapGlow />
        </div>
        <p className="text-layer-5">
          <FormattedMessage defaultMessage="Tunestr is a new kind of streaming platform that allows you to earn bitcoin (sats) the moment you start streaming! Viewers can tip streamers any amount they choose. The tips are instantly deposited to your bitcoin (lightning) wallet. tunestr.io never touches your earnings!" />
        </p>
      </div>
      <h3>
        <FormattedMessage defaultMessage="Pricing" />
      </h3>
      <p className="text-layer-5">
        <FormattedMessage defaultMessage="tunestr.io is an open source platform powered by the nostr protocol. There are no giant corporations or giant funds available to provide free streaming." />
      </p>
      <p className="text-layer-5">
        <FormattedMessage
          defaultMessage="Streamers pay a small fee to cover our running costs. We give new streamers a credit of {amount} sats (about {time_estimate} of streaming) to get started!"
          values={{
            amount: <FormattedNumber value={defaultSatsBalance} />,
            time_estimate: <BalanceTimeEstimate balance={defaultSatsBalance} endpoint={defaultEndpoint} />,
          }}
        />
      </p>
      <p>
        <FormattedMessage
          defaultMessage="Current stream cost: {amount} sats/{unit} (about {usd}/day for a {x}hr stream)"
          values={{
            amount: defaultEndpoint.rate,
            unit: defaultEndpoint.unit,
            x: exampleHours,
            usd: <FormattedNumber value={exampleCost} style="currency" currency="USD" />,
          }}
        />
      </p>
      {!info?.tosAccepted && <AcceptTos provider={info?.name} tosLink={info?.tosLink} tos={tos} setTos={setTos} />}
      <DefaultButton
        disabled={!tos}
        onClick={async () => {
          if (!info?.tosAccepted) {
            await DefaultProvider.acceptTos();
          }
          navigate("/dashboard/step-1");
        }}>
        <FormattedMessage defaultMessage="Create Stream" />
        <Icon name="signal" />
      </DefaultButton>
    </div>
  );
}
