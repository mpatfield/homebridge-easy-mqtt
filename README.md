<p align="center">
<img src="https://raw.githubusercontent.com/mpatfield/homebridge-easy-mqtt/refs/heads/latest/img/banner.png" width="600">
</p>

<span align="center">

# Homebridge Easy MQTT

Homebridge plugin to integrate MQTT devices into Apple HomeKit

[![verified-by-homebridge](https://img.shields.io/badge/homebridge-verified-blueviolet?color=%23491F59&style=flat)](https://github.com/homebridge/homebridge/wiki/Verified-Plugins)
[![Discord](https://img.shields.io/discord/432663330281226270?color=728ED5&logo=discord&label=discord)](https://discord.gg/fdc46U7Kjv) \
[![npm](https://img.shields.io/npm/dw/homebridge-easy-mqtt)](https://www.npmjs.com/package/homebridge-easy-mqtt)
[![npm](https://img.shields.io/npm/dt/homebridge-easy-mqtt)](https://www.npmjs.com/package/homebridge-easy-mqtt)

</span>

## Disclaimer

Any issues or damage resulting from use of this plugin are not the fault of the developer. Use at your own risk.

## What does this plugin do?

[MQTT](https://mqtt.org/) is a fairly common communication protocol for smart devices such as [Shelly](https://shelly-api-docs.shelly.cloud/gen2/ComponentsAndServices/Mqtt/), [Tasmota](https://tasmota.github.io/docs/MQTT/), [Tuya](https://developer.tuya.com/en/docs/iot/MQTT-protocol?id=Kb65nphxrj8f1) and many others. While these devices are often not directly HomeKit compatible, Homebridge Easy MQTT lets you integrate them into your Apple Home.

Homebridge Easy MQTT aims to be a simple replacement for the fantastic [MQTTThing](https://github.com/arachnetech/homebridge-mqttthing) plugin which appears as though it's [no longer](https://github.com/arachnetech/homebridge-mqttthing/commits/master/) being actively developed.

This plugin is being actively improved over time as more use cases are requested. If there is an accessory type you'd like to see supported, please [create an issue in GitHub](https://github.com/mpatfield/homebridge-easy-mqtt/issues/new/choose).

Lots more details about Homebridge Easy MQTT can be found on the [wiki](https://github.com/mpatfield/homebridge-easy-mqtt/wiki).

## Credits

[fakegato-history](https://github.com/simont77/fakegato-history) by [@simont77](https://github.com/sponsors/simont77) *Copyright © 2017*

[Publish throttling](https://github.com/mpatfield/homebridge-easy-mqtt/commit/cab1cc0c3da3b3bc7e940e8c3d2323af758e0ee8) adapted from [file-async-utils-ts](https://gist.github.com/Justin-Credible/693529fa4672a0d97963b95a26897812#file-async-utils-ts) by [@Justin-Credible](https://github.com/sponsors/Justin-Credible)

[@nehmeroumani](https://github.com/nehmeroumani) for contributing Value Transformers to Easy MQTT

[@EjvindHald](https://github.com/sponsors/EjvindHald) for Danish translations

[@7ute](https://github.com/sponsors/7ute) for French translations

[@steffen-micdev](https://github.com/sponsors/steffen-micdev) for German translations

[@Shikaban](https://github.com/sponsors/Shikaban) for Italian translations

[@rursache](https://github.com/sponsors/rursache) for Romanian translations

[@khanhnd88](https://github.com/sponsors/khanhnd88) for Vietnamese translations

[Keryan Belahcene](https://www.instagram.com/keryan.me) for creating the [Flume](https://github.com/homebridge-plugins/homebridge-flume) header logo which I adapted for this plugin

[homebridge-mqttthing](https://github.com/arachnetech/homebridge-mqttthing) by [@arachnetech](https://github.com/arachnetech) which served as the main inspiration for this project

And to the amazing creators/contributors of [Homebridge](https://homebridge.io) who made this plugin possible!
