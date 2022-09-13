## Objects

<dl>
<dt><a href="#Main">Main</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#RPC">RPC</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#BananoUtil">BananoUtil</a> : <code>object</code></dt>
<dd></dd>
</dl>

<a name="Main"></a>

## Main : <code>object</code>
**Kind**: global namespace  
<a name="RPC"></a>

## RPC : <code>object</code>
**Kind**: global namespace  
<a name="BananoUtil"></a>

## BananoUtil : <code>object</code>
**Kind**: global namespace  

* [BananoUtil](#BananoUtil) : <code>object</code>
    * [.isSeedValid(seed)](#BananoUtil.isSeedValid) ⇒ <code>any</code>
    * [.getPrivateKeyFromSeed(seed, seedIx)](#BananoUtil.getPrivateKeyFromSeed) ⇒ <code>string</code>

<a name="BananoUtil.isSeedValid"></a>

### BananoUtil.isSeedValid(seed) ⇒ <code>any</code>
validates a seed.

**Kind**: static method of [<code>BananoUtil</code>](#BananoUtil)  
**Returns**: <code>any</code> - {valid:[true/false] message:[if false, why]}.  

| Param | Type | Description |
| --- | --- | --- |
| seed | <code>string</code> | the seed to use to validate. |

<a name="BananoUtil.getPrivateKeyFromSeed"></a>

### BananoUtil.getPrivateKeyFromSeed(seed, seedIx) ⇒ <code>string</code>
get private key from seed.

**Kind**: static method of [<code>BananoUtil</code>](#BananoUtil)  
**Returns**: <code>string</code> - the private key.  

| Param | Type | Description |
| --- | --- | --- |
| seed | <code>string</code> | the seed to use to validate. |
| seedIx | <code>number</code> | the index to use with the seed. |

