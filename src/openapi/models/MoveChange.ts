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
import type { MoveChangeEffectEntriesInner } from './MoveChangeEffectEntriesInner';
import {
    MoveChangeEffectEntriesInnerFromJSON,
    MoveChangeEffectEntriesInnerFromJSONTyped,
    MoveChangeEffectEntriesInnerToJSON,
    MoveChangeEffectEntriesInnerToJSONTyped,
} from './MoveChangeEffectEntriesInner';
import type { VersionGroupSummary } from './VersionGroupSummary';
import {
    VersionGroupSummaryFromJSON,
    VersionGroupSummaryFromJSONTyped,
    VersionGroupSummaryToJSON,
    VersionGroupSummaryToJSONTyped,
} from './VersionGroupSummary';
import type { TypeSummary } from './TypeSummary';
import {
    TypeSummaryFromJSON,
    TypeSummaryFromJSONTyped,
    TypeSummaryToJSON,
    TypeSummaryToJSONTyped,
} from './TypeSummary';

/**
 * 
 * @export
 * @interface MoveChange
 */
export interface MoveChange {
    /**
     * 
     * @type {number}
     * @memberof MoveChange
     */
    accuracy?: number | null;
    /**
     * 
     * @type {number}
     * @memberof MoveChange
     */
    power?: number | null;
    /**
     * 
     * @type {number}
     * @memberof MoveChange
     */
    pp?: number | null;
    /**
     * 
     * @type {number}
     * @memberof MoveChange
     */
    effectChance: number;
    /**
     * 
     * @type {Array<MoveChangeEffectEntriesInner>}
     * @memberof MoveChange
     */
    effectEntries: Array<MoveChangeEffectEntriesInner>;
    /**
     * 
     * @type {TypeSummary}
     * @memberof MoveChange
     */
    type: TypeSummary;
    /**
     * 
     * @type {VersionGroupSummary}
     * @memberof MoveChange
     */
    versionGroup: VersionGroupSummary;
}

/**
 * Check if a given object implements the MoveChange interface.
 */
export function instanceOfMoveChange(value: object): value is MoveChange {
    if (!('effectChance' in value) || value['effectChance'] === undefined) return false;
    if (!('effectEntries' in value) || value['effectEntries'] === undefined) return false;
    if (!('type' in value) || value['type'] === undefined) return false;
    if (!('versionGroup' in value) || value['versionGroup'] === undefined) return false;
    return true;
}

export function MoveChangeFromJSON(json: any): MoveChange {
    return MoveChangeFromJSONTyped(json, false);
}

export function MoveChangeFromJSONTyped(json: any, ignoreDiscriminator: boolean): MoveChange {
    if (json == null) {
        return json;
    }
    return {
        
        'accuracy': json['accuracy'] == null ? undefined : json['accuracy'],
        'power': json['power'] == null ? undefined : json['power'],
        'pp': json['pp'] == null ? undefined : json['pp'],
        'effectChance': json['effect_chance'],
        'effectEntries': ((json['effect_entries'] as Array<any>).map(MoveChangeEffectEntriesInnerFromJSON)),
        'type': TypeSummaryFromJSON(json['type']),
        'versionGroup': VersionGroupSummaryFromJSON(json['version_group']),
    };
}

export function MoveChangeToJSON(json: any): MoveChange {
    return MoveChangeToJSONTyped(json, false);
}

export function MoveChangeToJSONTyped(value?: MoveChange | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'accuracy': value['accuracy'],
        'power': value['power'],
        'pp': value['pp'],
        'effect_chance': value['effectChance'],
        'effect_entries': ((value['effectEntries'] as Array<any>).map(MoveChangeEffectEntriesInnerToJSON)),
        'type': TypeSummaryToJSON(value['type']),
        'version_group': VersionGroupSummaryToJSON(value['versionGroup']),
    };
}

