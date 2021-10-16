import { HelixUser } from "@twurple/api/lib";
import { api, chatClient } from "../index";

export const isBroadcaster = async (user: string, channel: string): Promise<boolean> => {
    return user == channel.substring(1);
}
export const isMod = async (userStr: string, channel: string): Promise<boolean> => {
    channel = channel.substring(1);
    const bc = await api.helix.users.getUserByName(channel) as HelixUser;
    const user = await api.helix.users.getUserByName(userStr) as HelixUser;
    let mods = await api.helix.moderation.getModerators(bc.id);
    mods.data.forEach(async (mod) => {
        if (mod.userId == user.id) {
            return true;
        }
    })
    return false;
}
export const isVIP = async (userStr: string, channel: string): Promise<boolean> => {
    channel = channel.substring(1);
    (await chatClient.getVips(channel)).forEach(async (vip) => {
        if (vip == userStr) {
            return true;
        }
    })
    return false;
}
export const isSub = async (userStr: string, channel: string): Promise<boolean> => {
    channel = channel.substring(1);
    const bc = await api.helix.users.getUserByName(channel) as HelixUser;
    const user = await api.helix.users.getUserByName(userStr) as HelixUser;
    if (await api.helix.subscriptions.checkUserSubscription(user, bc) != null) return true
    else return false
}
export const isFollowed = async (userStr: string, channel: string): Promise<boolean> => {
    channel = channel.substring(1);
    const bc = await api.helix.users.getUserByName(channel) as HelixUser;
    const user = await api.helix.users.getUserByName(userStr) as HelixUser;
    return await user.follows(bc)
}