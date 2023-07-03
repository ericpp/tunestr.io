import { EventKind, EventPublisher } from "@snort/system";
import { useLogin } from "hooks/login";
import useFollows from "hooks/follows";
import AsyncButton from "element/async-button";
import { System } from "index";

export function LoggedInFollowButton({
  loggedIn,
  pubkey,
}: {
  loggedIn: string;
  pubkey: string;
}) {
  const { contacts, relays } = useFollows(loggedIn, true);
  const isFollowing = contacts.find((t) => t.at(1) === pubkey);

  async function unfollow() {
    const pub = await EventPublisher.nip7();
    if (pub) {
      const ev = await pub.generic((eb) => {
        eb.kind(EventKind.ContactList).content(JSON.stringify(relays));
        for (const c of contacts) {
          if (c.at(1) !== pubkey) {
            eb.tag(c);
          }
        }
        return eb;
      });
      console.debug(ev);
      System.BroadcastEvent(ev);
    }
  }

  async function follow() {
    const pub = await EventPublisher.nip7();
    if (pub) {
      const ev = await pub.generic((eb) => {
        eb.kind(EventKind.ContactList).content(JSON.stringify(relays));
        for (const tag of contacts) {
          eb.tag(tag);
        }
        eb.tag(["p", pubkey]);
        return eb;
      });
      console.debug(ev);
      System.BroadcastEvent(ev);
    }
  }

  return (
    <AsyncButton
      type="button"
      className="btn btn-primary"
      onClick={isFollowing ? unfollow : follow}
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </AsyncButton>
  );
}

export function FollowButton({ pubkey }: { pubkey: string }) {
  const login = useLogin();
  return login?.pubkey ? (
    <LoggedInFollowButton loggedIn={login.pubkey} pubkey={pubkey} />
  ) : null;
}