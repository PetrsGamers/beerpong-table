# TODO ROADMAP

## Version 2 baseline

- finish new db schema
- add db seeding and helper scripts
- add new screens -

## version 2 upgrades

- bugfixes and QoL changes from the github issues page

## Version 2.1

- CSV / XLSX / pdf export of results
- public access to dashboard with results
- in-depth statistics, scores, even for individual players
- mobile optimized design

- settings / user configuration
- custom theming

# Screens design (URLs)

## /seasons <- probably redundant BUT we need to keep the "/" page as a dashboard or overview page for unlogged users ig

- list of seasons - CRUD (can start a new season, edit and delete)

## /seasons/{season_name}

- list of tournaments in given season - CRUD (can start a new tournament, edit and delete)

## /seasons/{season_name}/{tournament_name}

- list of matches in given tournament - CRUD (should already be implemented)

## OTHER

- fix player assignment to reflect new design
- fix the player and scores are saved, refactor the table page
- (change the table to support any number of players)
