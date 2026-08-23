# Dementor Club — Functional Service Contracts v1

Status: implementation-ready / providers pending
Branch: `dementor-club-site`

This document defines how external services are attached to the public site without changing page architecture.

## Central configuration

File: `/site-config.js`

External service settings are never scattered across HTML pages. The config owns feature activation and provider URLs.

## Contacts

Required config:
- `contacts.enabled`
- `contacts.endpoint`
- optional `publicEmail`
- optional `socialLinks`

Form payload:
- `name`
- `email`
- `category`
- `message`

Until an endpoint is approved the form remains visible but submit is disabled. The site must never show a success state without a successful endpoint response.

## Donate

Required config:
- `donate.enabled`
- `donate.provider`
- `donate.checkoutUrl`
- `donate.currency`
- `donate.recurring`

Until approved, the support page stays public but the payment action remains disabled. Never publish temporary personal cards, wallets, or team-member payment links as a public club channel.

## Merch checkout

Required object fields before sale:
- stable `OBJECT ID`
- approved title and statement
- status allowing public sale
- material
- edition/availability if applicable
- approved price and currency
- public object URL

Required site config:
- `merch.checkoutEnabled`
- `merch.checkoutProvider`
- `merch.checkoutUrl`

The product/object page owns cultural meaning and product facts. The checkout adapter owns transaction routing. Provider implementation must not redefine the object record.

## Onboarding storage

Current storage remains local browser storage under `dementorClubOnboardingV3`. A capability guard exists at `/join-storage-guard.js`. If onboarding is later moved to server profiles, Privacy and Terms must be revised before deployment.

## Activation rule

An external feature is considered LIVE only when:
1. source-of-truth approves the public mechanic;
2. provider/endpoint data is confirmed;
3. privacy/legal implications are reviewed;
4. `site-config.js` is updated;
5. production QA confirms the service response.
