# DEMENTOR CLUB — LEGAL LAYER

Status: `DRAFT / NOT PRODUCTION READY`
Version: `v0.2`
Updated: `2026-08-28`
Jurisdiction baseline: Poland / EU

This directory is the legal source layer for Dementor Club. It is not a substitute for individual legal or accounting review.

## Priority

The legal layer is designed to:

1. protect the operator of Dementor Club without attempting to waive mandatory consumer rights;
2. describe only real product, checkout, account and event behaviour;
3. separate ordinary merchandise from genuinely individualised Objects;
4. preserve evidence of information supplied to a customer before payment;
5. prevent satire or brand language from creating false legal promises.

## Files

- `REGULAMIN_SPRZEDAZY_DRAFT_V0.2_PL.md` — Polish master draft for site use, sales, preorder, Objects, events and digital products.
- `PRIVACY_POLICY_DRAFT_V0.2_PL.md` — Polish GDPR / browser-storage draft based on the current Supabase + Google account architecture.
- `DISCLAIMER_SUPPORT_DRAFT_V0.2_PL.md` — disclaimers and Support rules.
- `IMPLEMENTATION_CHECKLIST_V0.2.md` — blocking data and implementation requirements before checkout can be considered production-ready.

## Language rule

For consumer transactions directed to customers in Poland, Polish legal copy is the primary publication version. Russian and English may be supplied as convenience translations, but they must not contradict the Polish version.

## Operator data — blocker

The repository does not currently contain an approved complete set of public operator data. Before production publication, replace all placeholders with approved business data:

- full legal name / JDG business name;
- NIP;
- REGON if used publicly;
- CEIDG registration information where applicable;
- business/contact address;
- complaints/returns address;
- legal/privacy email;
- phone if legally required/used;
- VAT status and invoicing rules;
- approved payment account / payment-provider data.

Do not reconstruct these details from personal documents or unrelated Drive files.

## Product-protection principle

`PREORDER` by itself does not remove the statutory right of withdrawal.

A product may use the personalised-goods exception only when the product is genuinely made/finished according to an individual customer specification. Standard size, colour, edition number, or selecting from preset options is not enough.

For `OBJECT 001 — НЕ НАДО`, the protected model is therefore:

`ORDER → CUSTOMER OWNER MARK → SPEC CONFIRMATION → PAYMENT → PRODUCTION/FINAL MACHINING → PERMANENT PERSONALISATION → QC → SHIPMENT`

The individual specification must become part of the actual object and evidence of that specification must be retained.

## Brand voice rule

Legal meaning always wins over the joke.

Allowed brand line:

> Мы отвечаем за то, что сделали. Мы не отвечаем за то, что после этого вы решили, что вам всё-таки было НЕ НАДО.

It may only appear next to a precise explanation of statutory conformity rights and the personalised-product withdrawal exception.