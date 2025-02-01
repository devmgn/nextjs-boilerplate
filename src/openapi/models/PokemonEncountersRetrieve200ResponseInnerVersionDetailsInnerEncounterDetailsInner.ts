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
import type { PokemonEncountersRetrieve200ResponseInnerVersionDetailsInnerEncounterDetailsInnerConditionValuesInner } from './PokemonEncountersRetrieve200ResponseInnerVersionDetailsInnerEncounterDetailsInnerConditionValuesInner';
import {
    PokemonEncountersRetrieve200ResponseInnerVersionDetailsInnerEncounterDetailsInnerConditionValuesInnerFromJSON,
    PokemonEncountersRetrieve200ResponseInnerVersionDetailsInnerEncounterDetailsInnerConditionValuesInnerFromJSONTyped,
    PokemonEncountersRetrieve200ResponseInnerVersionDetailsInnerEncounterDetailsInnerConditionValuesInnerToJSON,
    PokemonEncountersRetrieve200ResponseInnerVersionDetailsInnerEncounterDetailsInnerConditionValuesInnerToJSONTyped,
} from './PokemonEncountersRetrieve200ResponseInnerVersionDetailsInnerEncounterDetailsInnerConditionValuesInner';
import type { PokemonEncountersRetrieve200ResponseInnerVersionDetailsInnerEncounterDetailsInnerMethod } from './PokemonEncountersRetrieve200ResponseInnerVersionDetailsInnerEncounterDetailsInnerMethod';
import {
    PokemonEncountersRetrieve200ResponseInnerVersionDetailsInnerEncounterDetailsInnerMethodFromJSON,
    PokemonEncountersRetrieve200ResponseInnerVersionDetailsInnerEncounterDetailsInnerMethodFromJSONTyped,
    PokemonEncountersRetrieve200ResponseInnerVersionDetailsInnerEncounterDetailsInnerMethodToJSON,
    PokemonEncountersRetrieve200ResponseInnerVersionDetailsInnerEncounterDetailsInnerMethodToJSONTyped,
} from './PokemonEncountersRetrieve200ResponseInnerVersionDetailsInnerEncounterDetailsInnerMethod';

/**
 * 
 * @export
 * @interface PokemonEncountersRetrieve200ResponseInnerVersionDetailsInnerEncounterDetailsInner
 */
export interface PokemonEncountersRetrieve200ResponseInnerVersionDetailsInnerEncounterDetailsInner {
    /**
     * 
     * @type {number}
     * @memberof PokemonEncountersRetrieve200ResponseInnerVersionDetailsInnerEncounterDetailsInner
     */
    chance: number;
    /**
     * 
     * @type {Array<PokemonEncountersRetrieve200ResponseInnerVersionDetailsInnerEncounterDetailsInnerConditionValuesInner>}
     * @memberof PokemonEncountersRetrieve200ResponseInnerVersionDetailsInnerEncounterDetailsInner
     */
    conditionValues: Array<PokemonEncountersRetrieve200ResponseInnerVersionDetailsInnerEncounterDetailsInnerConditionValuesInner>;
    /**
     * 
     * @type {number}
     * @memberof PokemonEncountersRetrieve200ResponseInnerVersionDetailsInnerEncounterDetailsInner
     */
    maxLevel: number;
    /**
     * 
     * @type {PokemonEncountersRetrieve200ResponseInnerVersionDetailsInnerEncounterDetailsInnerMethod}
     * @memberof PokemonEncountersRetrieve200ResponseInnerVersionDetailsInnerEncounterDetailsInner
     */
    method: PokemonEncountersRetrieve200ResponseInnerVersionDetailsInnerEncounterDetailsInnerMethod;
    /**
     * 
     * @type {number}
     * @memberof PokemonEncountersRetrieve200ResponseInnerVersionDetailsInnerEncounterDetailsInner
     */
    minLevel: number;
}

/**
 * Check if a given object implements the PokemonEncountersRetrieve200ResponseInnerVersionDetailsInnerEncounterDetailsInner interface.
 */
export function instanceOfPokemonEncountersRetrieve200ResponseInnerVersionDetailsInnerEncounterDetailsInner(value: object): value is PokemonEncountersRetrieve200ResponseInnerVersionDetailsInnerEncounterDetailsInner {
    if (!('chance' in value) || value['chance'] === undefined) return false;
    if (!('conditionValues' in value) || value['conditionValues'] === undefined) return false;
    if (!('maxLevel' in value) || value['maxLevel'] === undefined) return false;
    if (!('method' in value) || value['method'] === undefined) return false;
    if (!('minLevel' in value) || value['minLevel'] === undefined) return false;
    return true;
}

export function PokemonEncountersRetrieve200ResponseInnerVersionDetailsInnerEncounterDetailsInnerFromJSON(json: any): PokemonEncountersRetrieve200ResponseInnerVersionDetailsInnerEncounterDetailsInner {
    return PokemonEncountersRetrieve200ResponseInnerVersionDetailsInnerEncounterDetailsInnerFromJSONTyped(json, false);
}

export function PokemonEncountersRetrieve200ResponseInnerVersionDetailsInnerEncounterDetailsInnerFromJSONTyped(json: any, ignoreDiscriminator: boolean): PokemonEncountersRetrieve200ResponseInnerVersionDetailsInnerEncounterDetailsInner {
    if (json == null) {
        return json;
    }
    return {
        
        'chance': json['chance'],
        'conditionValues': ((json['condition_values'] as Array<any>).map(PokemonEncountersRetrieve200ResponseInnerVersionDetailsInnerEncounterDetailsInnerConditionValuesInnerFromJSON)),
        'maxLevel': json['max_level'],
        'method': PokemonEncountersRetrieve200ResponseInnerVersionDetailsInnerEncounterDetailsInnerMethodFromJSON(json['method']),
        'minLevel': json['min_level'],
    };
}

export function PokemonEncountersRetrieve200ResponseInnerVersionDetailsInnerEncounterDetailsInnerToJSON(json: any): PokemonEncountersRetrieve200ResponseInnerVersionDetailsInnerEncounterDetailsInner {
    return PokemonEncountersRetrieve200ResponseInnerVersionDetailsInnerEncounterDetailsInnerToJSONTyped(json, false);
}

export function PokemonEncountersRetrieve200ResponseInnerVersionDetailsInnerEncounterDetailsInnerToJSONTyped(value?: PokemonEncountersRetrieve200ResponseInnerVersionDetailsInnerEncounterDetailsInner | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'chance': value['chance'],
        'condition_values': ((value['conditionValues'] as Array<any>).map(PokemonEncountersRetrieve200ResponseInnerVersionDetailsInnerEncounterDetailsInnerConditionValuesInnerToJSON)),
        'max_level': value['maxLevel'],
        'method': PokemonEncountersRetrieve200ResponseInnerVersionDetailsInnerEncounterDetailsInnerMethodToJSON(value['method']),
        'min_level': value['minLevel'],
    };
}

