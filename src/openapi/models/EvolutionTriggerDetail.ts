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
import type { AbilityDetailPokemonInnerPokemon } from './AbilityDetailPokemonInnerPokemon';
import {
    AbilityDetailPokemonInnerPokemonFromJSON,
    AbilityDetailPokemonInnerPokemonFromJSONTyped,
    AbilityDetailPokemonInnerPokemonToJSON,
    AbilityDetailPokemonInnerPokemonToJSONTyped,
} from './AbilityDetailPokemonInnerPokemon';
import type { EvolutionTriggerName } from './EvolutionTriggerName';
import {
    EvolutionTriggerNameFromJSON,
    EvolutionTriggerNameFromJSONTyped,
    EvolutionTriggerNameToJSON,
    EvolutionTriggerNameToJSONTyped,
} from './EvolutionTriggerName';

/**
 * 
 * @export
 * @interface EvolutionTriggerDetail
 */
export interface EvolutionTriggerDetail {
    /**
     * 
     * @type {number}
     * @memberof EvolutionTriggerDetail
     */
    readonly id: number;
    /**
     * 
     * @type {string}
     * @memberof EvolutionTriggerDetail
     */
    name: string;
    /**
     * 
     * @type {Array<EvolutionTriggerName>}
     * @memberof EvolutionTriggerDetail
     */
    names: Array<EvolutionTriggerName>;
    /**
     * 
     * @type {Array<AbilityDetailPokemonInnerPokemon>}
     * @memberof EvolutionTriggerDetail
     */
    pokemonSpecies: Array<AbilityDetailPokemonInnerPokemon>;
}

/**
 * Check if a given object implements the EvolutionTriggerDetail interface.
 */
export function instanceOfEvolutionTriggerDetail(value: object): value is EvolutionTriggerDetail {
    if (!('id' in value) || value['id'] === undefined) return false;
    if (!('name' in value) || value['name'] === undefined) return false;
    if (!('names' in value) || value['names'] === undefined) return false;
    if (!('pokemonSpecies' in value) || value['pokemonSpecies'] === undefined) return false;
    return true;
}

export function EvolutionTriggerDetailFromJSON(json: any): EvolutionTriggerDetail {
    return EvolutionTriggerDetailFromJSONTyped(json, false);
}

export function EvolutionTriggerDetailFromJSONTyped(json: any, ignoreDiscriminator: boolean): EvolutionTriggerDetail {
    if (json == null) {
        return json;
    }
    return {
        
        'id': json['id'],
        'name': json['name'],
        'names': ((json['names'] as Array<any>).map(EvolutionTriggerNameFromJSON)),
        'pokemonSpecies': ((json['pokemon_species'] as Array<any>).map(AbilityDetailPokemonInnerPokemonFromJSON)),
    };
}

export function EvolutionTriggerDetailToJSON(json: any): EvolutionTriggerDetail {
    return EvolutionTriggerDetailToJSONTyped(json, false);
}

export function EvolutionTriggerDetailToJSONTyped(value?: Omit<EvolutionTriggerDetail, 'id'> | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'name': value['name'],
        'names': ((value['names'] as Array<any>).map(EvolutionTriggerNameToJSON)),
        'pokemon_species': ((value['pokemonSpecies'] as Array<any>).map(AbilityDetailPokemonInnerPokemonToJSON)),
    };
}

