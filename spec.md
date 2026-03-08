# Buyo

## Current State

Buyo is a collaborative shopping list app with:
- An onboarding screen with three options: Make a Family, Join a Family, Single List
- Family mode: data stored in the backend scoped to a family name + password
- Single mode: data stored per Internet Identity principal
- Session persistence via localStorage so users stay logged in on reload
- A full shopping list UI with catalog items, multiple lists, clone/delete, item completion and editing

## Requested Changes (Diff)

### Add
- Nothing new to add

### Modify
- Fix `initFamilyCatalog` in the backend: the current implementation uses a fixed `family.catalogItemIndex + 1` for every item in the loop, so every catalog item gets assigned ID `1` (overwriting the previous entry). The index must be incremented with each item, and the family record must be updated with the final index value after the loop completes.

### Remove
- Nothing to remove

## Implementation Plan

1. Regenerate Motoko backend with corrected `initFamilyCatalog` logic:
   - Use a mutable local counter starting from `family.catalogItemIndex`
   - Increment it for each item added in the loop
   - After the loop, update the family record with the final counter value via `families.add(familyName, updatedFamily)`
