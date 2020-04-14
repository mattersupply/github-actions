# Matter Env Github Action

This action does the common setup that we use for our monorepo configured web experiences.

## Inputs

### `who-to-greet`

**Required** The name of the person to greet. Default `"World"`.

## Outputs

### `time`

The time we greeted you.

## Example usage

```
  uses: actions/hello-world-javascript-action@v1
  with:
    who-to-greet: 'Mona the Octocat'
```
