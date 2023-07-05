import "./profile.css";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useUserProfile } from "@snort/system-react";
import { UserMetadata } from "@snort/system";
import { hexToBech32 } from "@snort/shared";
import { Icon } from "element/icon";
import { System } from "index";
import { useInView } from "react-intersection-observer";

export interface ProfileOptions {
  showName?: boolean;
  showAvatar?: boolean;
  suffix?: string;
  overrideName?: string;
}

export function getName(pk: string, user?: UserMetadata) {
  const npub = hexToBech32("npub", pk);
  const shortPubkey = npub.slice(0, 12);
  if ((user?.name?.length ?? 0) > 0) {
    return user?.name;
  }
  if ((user?.display_name?.length ?? 0) > 0) {
    return user?.display_name;
  }
  return shortPubkey;
}

export function Profile({
  pubkey,
  icon,
  avatarClassname,
  options,
  profile,
}: {
  pubkey: string;
  icon?: ReactNode;
  avatarClassname?: string;
  options?: ProfileOptions;
  profile?: UserMetadata;
}) {
  const { inView, ref } = useInView();
  const pLoaded =
    useUserProfile(System, inView && !profile ? pubkey : undefined) || profile;
  const showAvatar = options?.showAvatar ?? true;
  const showName = options?.showName ?? true;

  const content = (
    <>
      {showAvatar &&
        (pubkey === "anon" ? (
          <Icon size={40} name="zap-filled" />
        ) : (
          <img
            alt={pLoaded?.name || pubkey}
            className={avatarClassname ? avatarClassname : ""}
            src={pLoaded?.picture ?? ""}
          />
        ))}
      {icon}
      {showName && (
        <span>
          {options?.overrideName ?? pubkey === "anon"
            ? "Anon"
            : getName(pubkey, pLoaded)}
        </span>
      )}
    </>
  );

  return pubkey === "anon" ? (
    <div className="profile" ref={ref}>
      {content}
    </div>
  ) : (
    <Link
      to={`/p/${hexToBech32("npub", pubkey)}`}
      className="profile"
      ref={ref}
    >
      {content}
    </Link>
  );
}
