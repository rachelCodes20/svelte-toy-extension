<script>
    import { parse } from "svelte/compiler";
    import { onMount } from 'svelte';
    import * as d3 from 'd3';
import { children } from "svelte/internal";

    let svelteFiles = []
    let astArray = []
    let data;
    
    onMount(async () => {
        await chrome.devtools.inspectedWindow.getResources(resources => {
            svelteFiles = resources.filter(resource => resource.url.includes('.svelte'))
        
            svelteFiles.forEach(file => {
                file.getContent(source => {
                    const ast = parse(source)
                    console.log(file.url)
                    console.log(ast)
                    const parsedAST = parseAST(ast)
                    const astObj = {name: file.url, astData: parsedAST}
                    astArray = [...astArray, astObj]      
                })
            })
        })
    })
    
    function parseAST(ast) {
        let children = []
        let state = []
        let store = []
        let props = []
        let reactives = []

        ast.instance.content.body.forEach(declaration => {
            switch(declaration.type) {
                case "ImportDeclaration": {
                    if (declaration.source.value.includes('.svelte')) {
                        children = [...children, declaration.specifiers[0].local.name]
                    } else if (declaration.source.value.includes('stores.js')) {
                        store = [...store, declaration.specifiers[0].local.name]
                    }
                    break
                }
                case "VariableDeclaration": {
                    if (!declaration.declarations[0].init || (declaration.declarations[0].init.type === "Literal")) {
                        state = [... state, declaration.declarations[0].id.name]
                    }
                    break
                }
                case "ExportNamedDeclaration": {
                    if (declaration.declaration.type !== "FunctionDeclaration") {
                        props = [...props, declaration.declaration.declarations[0].id.name]
                    }
                    break
                }
                case "LabeledStatement": {
                     if (declaration.body.type === "ExpressionStatement" && declaration.body.expression.type === "AssignmentExpression") {
                         reactives = [...reactives, declaration.body.expression.left.name]
                     }
                     break
                }
            }
        })
        data = children;
        const astData = {
                children,
                state,
                store,
                props,
                reactives
        }

        return astData
    }
// let el;
//     onMount(() => {
// 		d3.select(el)
// 			.select("div")
// 			.data(data)
// 			.enter()
// 			.append("div")
// 			.style("width", function(d) {
// 				return d + "px";
// 			})
// 			.text(function(d) {
// 				return d;
// 			});
// 	});
</script>

<!-- <style>
	.chart :global(div) {
		font: 10px sans-serif;
		background-color: steelblue;
		text-align: right;
		padding: 3px;
		margin: 1px;
		color: white;
	}
</style> -->

<!-- <div bind:this={el} class="chart"></div> -->
<p>{data}</p>

<div>
    <ul>
        {#each astArray as ast}
            <li>{ast.name}</li>
            <ul>
                {#if ast.astData.children.length}
                <li>Children</li>
                <ul>
                    {#each ast.astData.children as child}
                        <li>{child}</li>
                    {/each}
                </ul>
                {/if}
            </ul>
            <ul>
                {#if ast.astData.state.length}
                <li>State Variables 1</li>
                <ul>
                    {#each ast.astData.state as element}
                        <li>{element}</li>
                    {/each}
                </ul>
                {/if}
            </ul>
            <ul>
                {#if ast.astData.store.length}
                <li>Store Variables</li>
                <ul>
                    {#each ast.astData.store as element}
                        <li>{element}</li>
                    {/each}
                </ul>
                {/if}
            </ul>
            <ul>
                {#if ast.astData.props.length}
                <li>Props</li>
                <ul>
                    {#each ast.astData.props as prop}
                        <li>{prop}</li>
                    {/each}
                </ul>
                {/if}
            </ul> <ul>
                {#if ast.astData.reactives.length}
                <li>Reactive Variables</li>
                <ul>
                    {#each ast.astData.reactives as element}
                        <li>{element}</li>
                    {/each}
                </ul>
                {/if}
            </ul>
            <br>
            <hr>
        {/each}
    </ul>
    

</div>


