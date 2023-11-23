// To parse this data:
//
//   const Convert = require("./file");
//
//   const landingPageModel = Convert.toLandingPageModel(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
function toLandingPageModel(json) {
    return cast(JSON.parse(json), a(r("LandingPageModel")));
}

function landingPageModelToJson(value) {
    return JSON.stringify(uncast(value, a(r("LandingPageModel"))), null, 2);
}

function invalidValue(typ, val, key, parent = '') {
    const prettyTyp = prettyTypeName(typ);
    const parentText = parent ? ` on ${parent}` : '';
    const keyText = key ? ` for key "${key}"` : '';
    throw Error(`Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(val)}`);
}

function prettyTypeName(typ) {
    if (Array.isArray(typ)) {
        if (typ.length === 2 && typ[0] === undefined) {
            return `an optional ${prettyTypeName(typ[1])}`;
        } else {
            return `one of [${typ.map(a => { return prettyTypeName(a); }).join(", ")}]`;
        }
    } else if (typeof typ === "object" && typ.literal !== undefined) {
        return typ.literal;
    } else {
        return typeof typ;
    }
}

function jsonToJSProps(typ) {
    if (typ.jsonToJS === undefined) {
        const map = {};
        typ.props.forEach((p) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ) {
    if (typ.jsToJSON === undefined) {
        const map = {};
        typ.props.forEach((p) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val, typ, getProps, key = '', parent = '') {
    function transformPrimitive(typ, val) {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key, parent);
    }

    function transformUnion(typs, val) {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val, key, parent);
    }

    function transformEnum(cases, val) {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases.map(a => { return l(a); }), val, key, parent);
    }

    function transformArray(typ, val) {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue(l("array"), val, key, parent);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val) {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue(l("Date"), val, key, parent);
        }
        return d;
    }

    function transformObject(props, additional, val) {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue(l(ref || "object"), val, key, parent);
        }
        const result = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, key, ref);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key, ref);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val, key, parent);
    }
    if (typ === false) return invalidValue(typ, val, key, parent);
    let ref = undefined;
    while (typeof typ === "object" && typ.ref !== undefined) {
        ref = typ.ref;
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val, key, parent);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast(val, typ) {
    return transform(val, typ, jsonToJSProps);
}

function uncast(val, typ) {
    return transform(val, typ, jsToJSONProps);
}

function l(typ) {
    return { literal: typ };
}

function a(typ) {
    return { arrayItems: typ };
}

function u(...typs) {
    return { unionMembers: typs };
}

function o(props, additional) {
    return { props, additional };
}

function m(additional) {
    return { props: [], additional };
}

function r(name) {
    return { ref: name };
}

const typeMap = {
    "LandingPageModel": o([
        { json: "id", js: "id", typ: 0 },
        { json: "main_users_id", js: "main_users_id", typ: 0 },
        { json: "business_name", js: "business_name", typ: "" },
        { json: "price_range", js: "price_range", typ: 0 },
        { json: "facebook_messenger_link", js: "facebook_messenger_link", typ: "" },
        { json: "website_url", js: "website_url", typ: "" },
        { json: "phone_number", js: "phone_number", typ: "" },
        { json: "email", js: "email", typ: "" },
        { json: "address", js: "address", typ: "" },
        { json: "city", js: "city", typ: "" },
        { json: "country", js: "country", typ: "" },
        { json: "country_state", js: "country_state", typ: "" },
        { json: "bio", js: "bio", typ: "" },
        { json: "cover_photo_url", js: "cover_photo_url", typ: "" },
        { json: "business_tags_id", js: "business_tags_id", typ: a(0) },
        { json: "BusinessPictures", js: "BusinessPictures", typ: a("") },
        { json: "location", js: "location", typ: r("Location") },
        { json: "_overal_business_reviews_of_business", js: "_overal_business_reviews_of_business", typ: r("OveralBusinessReviewsOfBusiness") },
        { json: "_top_businesses_of_business", js: "_top_businesses_of_business", typ: r("TopBusinessesOfBusiness") },
        { json: "_business_reviews_of_business", js: "_business_reviews_of_business", typ: a(r("BusinessReviewsOfBusiness")) },
        { json: "_events_of_business", js: "_events_of_business", typ: a(r("EventsOfBusiness")) },
        { json: "_posts_of_main_users", js: "_posts_of_main_users", typ: a(r("PostsOfMainUser")) },
        { json: "_main_users", js: "_main_users", typ: r("MainUsers") },
    ], false),
    "BusinessReviewsOfBusiness": o([
        { json: "id", js: "id", typ: 0 },
        { json: "created_at", js: "created_at", typ: 0 },
        { json: "creator_main_users_id", js: "creator_main_users_id", typ: 0 },
        { json: "owner_business_id", js: "owner_business_id", typ: 0 },
        { json: "review_description", js: "review_description", typ: "" },
        { json: "review_tags_id", js: "review_tags_id", typ: a(0) },
        { json: "overal_business_review_score", js: "overal_business_review_score", typ: 0 },
        { json: "_main_users_for_business_reviews", js: "_main_users_for_business_reviews", typ: r("MainUsersFor") },
    ], false),
    "MainUsersFor": o([
        { json: "id", js: "id", typ: 0 },
        { json: "name", js: "name", typ: r("Name") },
        { json: "profile_picture", js: "profile_picture", typ: "" },
        { json: "user_role", js: "user_role", typ: u(undefined, "") },
    ], false),
    "EventsOfBusiness": o([
        { json: "id", js: "id", typ: 0 },
        { json: "created_at", js: "created_at", typ: 0 },
        { json: "label", js: "label", typ: "" },
        { json: "description", js: "description", typ: "" },
        { json: "event_date", js: "event_date", typ: 0 },
        { json: "owner_business_id", js: "owner_business_id", typ: 0 },
        { json: "location", js: "location", typ: "" },
        { json: "cover_photo", js: "cover_photo", typ: "" },
        { json: "going_users_count", js: "going_users_count", typ: 0 },
        { json: "_event_comments_list_of_events", js: "_event_comments_list_of_events", typ: a(r("EventCommentsListOfEvent")) },
    ], false),
    "EventCommentsListOfEvent": o([
        { json: "id", js: "id", typ: 0 },
        { json: "created_at", js: "created_at", typ: 0 },
        { json: "creator_main_users_id", js: "creator_main_users_id", typ: 0 },
        { json: "owner_events_id", js: "owner_events_id", typ: 0 },
        { json: "description", js: "description", typ: "" },
        { json: "like_count", js: "like_count", typ: 0 },
        { json: "_main_users_for_event_comments", js: "_main_users_for_event_comments", typ: r("MainUsersFor") },
    ], false),
    "MainUsers": o([
        { json: "id", js: "id", typ: 0 },
        { json: "profile_picture", js: "profile_picture", typ: "" },
    ], false),
    "OveralBusinessReviewsOfBusiness": o([
        { json: "owner_business_id", js: "owner_business_id", typ: 0 },
        { json: "overal_business_score", js: "overal_business_score", typ: 3.14 },
        { json: "overal_menu_item_score", js: "overal_menu_item_score", typ: 3.14 },
        { json: "overal_service_score", js: "overal_service_score", typ: 3.14 },
        { json: "overal_ambience_score", js: "overal_ambience_score", typ: 3.14 },
        { json: "overal_value_score", js: "overal_value_score", typ: 3.14 },
    ], false),
    "PostsOfMainUser": o([
        { json: "id", js: "id", typ: 0 },
        { json: "created_at", js: "created_at", typ: 0 },
        { json: "creator_main_users_id", js: "creator_main_users_id", typ: 0 },
        { json: "description", js: "description", typ: "" },
        { json: "like_count", js: "like_count", typ: 0 },
        { json: "has_video", js: "has_video", typ: true },
        { json: "video_url", js: "video_url", typ: "" },
        { json: "hashtags", js: "hashtags", typ: a("") },
        { json: "photo_url", js: "photo_url", typ: u(a(""), null) },
        { json: "comments_count", js: "comments_count", typ: 0 },
        { json: "city", js: "city", typ: "" },
        { json: "country", js: "country", typ: "" },
        { json: "_post_comment_list_of_posts", js: "_post_comment_list_of_posts", typ: a(r("PostCommentListOfPost")) },
    ], false),
    "PostCommentListOfPost": o([
        { json: "id", js: "id", typ: 0 },
        { json: "created_at", js: "created_at", typ: 0 },
        { json: "main_users_id", js: "main_users_id", typ: 0 },
        { json: "owner_posts_id", js: "owner_posts_id", typ: 0 },
        { json: "description", js: "description", typ: "" },
        { json: "comment_like_count", js: "comment_like_count", typ: 0 },
        { json: "_main_users_for_post_comments", js: "_main_users_for_post_comments", typ: r("MainUsersFor") },
    ], false),
    "TopBusinessesOfBusiness": o([
        { json: "id", js: "id", typ: 0 },
        { json: "created_at", js: "created_at", typ: 0 },
        { json: "owner_business_id", js: "owner_business_id", typ: 0 },
        { json: "review_tags_id", js: "review_tags_id", typ: 0 },
        { json: "city", js: "city", typ: "" },
        { json: "rank_position_in_city", js: "rank_position_in_city", typ: 0 },
        { json: "was_top_on_this_day", js: "was_top_on_this_day", typ: Date },
        { json: "_review_tags", js: "_review_tags", typ: r("ReviewTags") },
    ], false),
    "ReviewTags": o([
        { json: "label", js: "label", typ: "" },
    ], false),
    "Location": o([
        { json: "type", js: "type", typ: "" },
        { json: "data", js: "data", typ: r("Data") },
    ], false),
    "Data": o([
        { json: "lng", js: "lng", typ: 3.14 },
        { json: "lat", js: "lat", typ: 3.14 },
    ], false),
    "Name": [
        "გიორგი შერვაშიძე",
        "მარი ლომია",
    ],
};

module.exports = {
    "landingPageModelToJson": landingPageModelToJson,
    "toLandingPageModel": toLandingPageModel,
};
