import RandomUtil from "@/plugins/randomUtil"
import { Inbound } from "@/types/inbounds"

export interface Link {
  type: "local" | "external" | "sub"
  remark?: string
  uri: string
}

export interface Client {
  id?: number
  enable: boolean
  name: string
  config?: Config
  inbounds: number[]
  links?: Link[]
  volume: number
  expiry: number
  up: number
  down: number
  desc: string
  group: string
}

const defaultClient: Client = {
  enable: true,
  name: "",
  config: {},
  inbounds: [],
  links: [],
  volume: 0,
  expiry: 0,
  up: 0,
  down: 0,
  desc: "",
  group: "",
}

type Config = {
  [key: string]: {
    name?: string
    username?: string
    [key: string]: any
  }
}

export function updateConfigs(configs: Config, newUserName: string): Config {
  for (const key in configs) {
    if (configs.hasOwnProperty(key)) {
      const config = configs[key]
      if (config.hasOwnProperty("name")) {
        config.name = newUserName
      } else if (config.hasOwnProperty("username")) {
        config.username = newUserName
      }
    }
  }
  return configs
}

export function shuffleConfigs(configs: Config, key?: string) {
  const keys = key ? [key] : Object.keys(configs)
  keys.forEach(k => {
    switch (k) {
      case "mixed":
      case "socks":
      case "http":
      case "anytls":
      case "trojan":
      case "naive":
      case "hysteria2":
        configs[k].password = RandomUtil.randomSeq(10)
        break
      case "shadowsocks":
        configs[k].password = RandomUtil.randomShadowsocksPassword(32)
        break
      case "shadowsocks16":
        configs[k].password = RandomUtil.randomShadowsocksPassword(16)
        break
      case "shadowtls":
        configs[k].password = RandomUtil.randomShadowsocksPassword(32)
        break
      case "hysteria":
        configs[k].auth_str = RandomUtil.randomSeq(10)
        break
      case "tuic":
        configs[k].password = RandomUtil.randomSeq(10)
        configs[k].uuid = RandomUtil.randomUUID()
        break
      case "vmess":
      case "vless":
        configs[k].uuid = RandomUtil.randomUUID()
        break
    }
  })
}

export function randomConfigs(user: string): Config {
  const config: Config = {
    mixed: {
      username: user,
    },
    socks: {
      username: user,
    },
    http: {
      username: user,
    },
    shadowsocks: {
      name: user,
    },
    shadowsocks16: {
      name: user,
    },
    shadowtls: {
      name: user,
    },
    vmess: {
      name: user,
      alterId: 0,
    },
    vless: {
      name: user,
      flow: "xtls-rprx-vision",
      flow_inbound_tags: [],
    },
    anytls: {
      name: user,
    },
    trojan: {
      name: user,
    },
    naive: {
      username: user,
    },
    hysteria: {
      name: user,
    },
    tuic: {
      name: user,
    },
    hysteria2: {
      name: user,
    },
  }
  shuffleConfigs(config)
  return config
}

export function createClient<T extends Client>(json?: Partial<T>): Client {
  defaultClient.name = RandomUtil.randomSeq(8)
  const defaultObject: Client = { ...defaultClient, ...(json || {}) }

  // Add missing config
  defaultObject.config = { ...randomConfigs(defaultObject.name), ...defaultObject.config }

  return defaultObject
}

export function getVlessInboundTags(inbounds: Inbound[], clientInboundIds: number[], tls: boolean) {
  if (!inbounds || !clientInboundIds) {
    return []
  }

  return inbounds
    .filter(inbound => clientInboundIds.includes(inbound.id))
    .filter(inbound => inbound.type === 'vless')
    .filter(inbound => tls ? inbound.tls_id > 0 : true)
    .map(inbound => ({ value: inbound.tag, title: inbound.tag }));
}
