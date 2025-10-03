import Home from "./views/HomeView.js";
import Pong from "./views/PongView.js";
import Contact from "./views/ContactView.js";


async function history_and_router(view_id)
{
    history.pushState({view : view_id}, null, null);
    router(null);
};

async function router(path)
{
    const view_obj_arr = [
        {id: "home_view", view: Home},
        {id: "pong_view", view: Pong},
        {id: "contact_view", view: Contact}
    ];

    var view_match_map, match, view;

    if (path === null)
        view_match_map = view_obj_arr.map(view_obj => {return {view_obj: view_obj, is_match: history.state !== null && history.state.view === view_obj.id};});
    else
        view_match_map = view_obj_arr.map(view_obj => {return {view_obj: view_obj, is_match: path === view_obj.id};});

    match = view_match_map.find(potential_match => potential_match.is_match);

    if (!match)
        match = {view_obj: view_obj_arr[0], is_match: true};

    view = new match.view_obj.view();

    await view.goToView();
};

window.onpopstate = async function()
{
    router(null);
};


//---------------------------------------------------------- Listeners ------------------------------------------------------------------------------


async function view_reference_listener(event)
{
    if (event.target.matches("[view-reference]"))
    {
        event.preventDefault();
        history_and_router(event.target.id);
    }
}

async function sub_view_reference_listener(event)
{
    if (event.target.matches("[sub-view-reference]"))
    {
        event.preventDefault();
        router(event.target.id);
    }
}

async function play_game_listener(event)
{
    if (event.target.id === "play_game")
    {
        var classes_arr = Array.from(event.target.classList)
        var game_class = {type_count: 0, mode_count: 0, t_count: 0, unknown: false};

        classes_arr.reduce(check_game_class, game_class);

        console.log(game_class);

        if (game_class.unknown ||
            game_class.type_count !== 1 ||
            game_class.mode_count !== 1 ||
            game_class.t_count !== 1 ||
            (game_class.mode==='2v2' && game_class.t !== null))
            return console.log('Incorrect game classes!');


        event.preventDefault();
        var game_view = (game_class.t === null) ? new Game : new Tournament;
        
        var player_left1 = game_class.mode === "1v1" ? get_player_name('left-select') : get_player_name('left-select1');
        var player_right1 = game_class.mode === "1v1" ? get_player_name('right-select') : get_player_name('right-select1');
        var player_left2 = game_class.mode === "1v1" ? null : get_player_name('left-select2');
        var player_right2 = game_class.mode === "1v1" ? null : get_player_name('right-select2');

        if (game_class.type === 'pong')
            game_view.play_pong(player_left1, player_left2, player_right1, player_right2, game_class.t);
        else
            game_view.play_snek(player_left1, player_left2, player_right1, player_right2, game_class.t);
    } 
}

function content_loaded_listener()
{
    document.body.addEventListener("click", e => view_reference_listener(e));
    document.body.addEventListener("click", e => sub_view_reference_listener(e));
    document.body.addEventListener("click", e => play_game_listener(e));
    
    router(null);
}

document.addEventListener("DOMContentLoaded", content_loaded_listener());