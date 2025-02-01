/* tslint:disable */
/* eslint-disable */
/**
 * PokéAPI
 * All the Pokémon data you\'ll ever need in one place, easily accessible through a modern free open-source RESTful API.  ## What is this?  This is a full RESTful API linked to an extensive database detailing everything about the Pokémon main game series.  We\'ve covered everything from Pokémon to Berry Flavors.  ## Where do I start?  We have awesome [documentation](https://pokeapi.co/docs/v2) on how to use this API. It takes minutes to get started.  This API will always be publicly available and will never require any extensive setup process to consume.  Created by [**Paul Hallett**(]https://github.com/phalt) and other [**PokéAPI contributors***](https://github.com/PokeAPI/pokeapi#contributing) around the world. Pokémon and Pokémon character names are trademarks of Nintendo.     
 *
 * The version of the OpenAPI document: 2.7.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { mapValues } from '../runtime';
import type { RegionName } from './RegionName';
import {
    RegionNameFromJSON,
    RegionNameFromJSONTyped,
    RegionNameToJSON,
    RegionNameToJSONTyped,
} from './RegionName';
import type { LocationSummary } from './LocationSummary';
import {
    LocationSummaryFromJSON,
    LocationSummaryFromJSONTyped,
    LocationSummaryToJSON,
    LocationSummaryToJSONTyped,
} from './LocationSummary';
import type { GenerationSummary } from './GenerationSummary';
import {
    GenerationSummaryFromJSON,
    GenerationSummaryFromJSONTyped,
    GenerationSummaryToJSON,
    GenerationSummaryToJSONTyped,
} from './GenerationSummary';
import type { AbilityDetailPokemonInnerPokemon } from './AbilityDetailPokemonInnerPokemon';
import {
    AbilityDetailPokemonInnerPokemonFromJSON,
    AbilityDetailPokemonInnerPokemonFromJSONTyped,
    AbilityDetailPokemonInnerPokemonToJSON,
    AbilityDetailPokemonInnerPokemonToJSONTyped,
} from './AbilityDetailPokemonInnerPokemon';
import type { PokedexSummary } from './PokedexSummary';
import {
    PokedexSummaryFromJSON,
    PokedexSummaryFromJSONTyped,
    PokedexSummaryToJSON,
    PokedexSummaryToJSONTyped,
} from './PokedexSummary';

/**
 * 
 * @export
 * @interface RegionDetail
 */
export interface RegionDetail {
    /**
     * 
     * @type {number}
     * @memberof RegionDetail
     */
    readonly id: number;
    /**
     * 
     * @type {string}
     * @memberof RegionDetail
     */
    name: string;
    /**
     * 
     * @type {Array<LocationSummary>}
     * @memberof RegionDetail
     */
    locations: Array<LocationSummary>;
    /**
     * 
     * @type {GenerationSummary}
     * @memberof RegionDetail
     */
    readonly mainGeneration: GenerationSummary;
    /**
     * 
     * @type {Array<RegionName>}
     * @memberof RegionDetail
     */
    names: Array<RegionName>;
    /**
     * 
     * @type {Array<PokedexSummary>}
     * @memberof RegionDetail
     */
    pokedexes: Array<PokedexSummary>;
    /**
     * 
     * @type {Array<AbilityDetailPokemonInnerPokemon>}
     * @memberof RegionDetail
     */
    versionGroups: Array<AbilityDetailPokemonInnerPokemon>;
}

/**
 * Check if a given object implements the RegionDetail interface.
 */
export function instanceOfRegionDetail(value: object): value is RegionDetail {
    if (!('id' in value) || value['id'] === undefined) return false;
    if (!('name' in value) || value['name'] === undefined) return false;
    if (!('locations' in value) || value['locations'] === undefined) return false;
    if (!('mainGeneration' in value) || value['mainGeneration'] === undefined) return false;
    if (!('names' in value) || value['names'] === undefined) return false;
    if (!('pokedexes' in value) || value['pokedexes'] === undefined) return false;
    if (!('versionGroups' in value) || value['versionGroups'] === undefined) return false;
    return true;
}

export function RegionDetailFromJSON(json: any): RegionDetail {
    return RegionDetailFromJSONTyped(json, false);
}

export function RegionDetailFromJSONTyped(json: any, ignoreDiscriminator: boolean): RegionDetail {
    if (json == null) {
        return json;
    }
    return {
        
        'id': json['id'],
        'name': json['name'],
        'locations': ((json['locations'] as Array<any>).map(LocationSummaryFromJSON)),
        'mainGeneration': GenerationSummaryFromJSON(json['main_generation']),
        'names': ((json['names'] as Array<any>).map(RegionNameFromJSON)),
        'pokedexes': ((json['pokedexes'] as Array<any>).map(PokedexSummaryFromJSON)),
        'versionGroups': ((json['version_groups'] as Array<any>).map(AbilityDetailPokemonInnerPokemonFromJSON)),
    };
}

export function RegionDetailToJSON(json: any): RegionDetail {
    return RegionDetailToJSONTyped(json, false);
}

export function RegionDetailToJSONTyped(value?: Omit<RegionDetail, 'id'|'main_generation'> | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'name': value['name'],
        'locations': ((value['locations'] as Array<any>).map(LocationSummaryToJSON)),
        'names': ((value['names'] as Array<any>).map(RegionNameToJSON)),
        'pokedexes': ((value['pokedexes'] as Array<any>).map(PokedexSummaryToJSON)),
        'version_groups': ((value['versionGroups'] as Array<any>).map(AbilityDetailPokemonInnerPokemonToJSON)),
    };
}

