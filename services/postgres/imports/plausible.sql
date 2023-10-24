--
-- PostgreSQL database dump
--

-- Dumped from database version 14.5 (Debian 14.5-1.pgdg110+1)
-- Dumped by pg_dump version 14.5 (Debian 14.5-1.pgdg110+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: citext; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS citext WITH SCHEMA public;


--
-- Name: EXTENSION citext; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION citext IS 'data type for case-insensitive character strings';


--
-- Name: billing_interval; Type: TYPE; Schema: public; Owner: plausible
--

CREATE TYPE public.billing_interval AS ENUM (
    'monthly',
    'yearly'
);


ALTER TYPE public.billing_interval OWNER TO plausible;

--
-- Name: oban_job_state; Type: TYPE; Schema: public; Owner: plausible
--

CREATE TYPE public.oban_job_state AS ENUM (
    'available',
    'scheduled',
    'executing',
    'retryable',
    'completed',
    'discarded',
    'cancelled'
);


ALTER TYPE public.oban_job_state OWNER TO plausible;

--
-- Name: site_membership_role; Type: TYPE; Schema: public; Owner: plausible
--

CREATE TYPE public.site_membership_role AS ENUM (
    'owner',
    'admin',
    'viewer'
);


ALTER TYPE public.site_membership_role OWNER TO plausible;

--
-- Name: oban_jobs_notify(); Type: FUNCTION; Schema: public; Owner: plausible
--

CREATE FUNCTION public.oban_jobs_notify() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  channel text;
  notice json;
BEGIN
  IF NEW.state = 'available' THEN
    channel = 'public.oban_insert';
    notice = json_build_object('queue', NEW.queue);

    PERFORM pg_notify(channel, notice::text);
  END IF;

  RETURN NULL;
END;
$$;


ALTER FUNCTION public.oban_jobs_notify() OWNER TO plausible;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: api_keys; Type: TABLE; Schema: public; Owner: plausible
--

CREATE TABLE public.api_keys (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    name character varying(255) NOT NULL,
    key_prefix character varying(255) NOT NULL,
    key_hash character varying(255) NOT NULL,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL,
    scopes text[] NOT NULL,
    hourly_request_limit integer DEFAULT 1000 NOT NULL
);


ALTER TABLE public.api_keys OWNER TO plausible;

--
-- Name: api_keys_id_seq; Type: SEQUENCE; Schema: public; Owner: plausible
--

CREATE SEQUENCE public.api_keys_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.api_keys_id_seq OWNER TO plausible;

--
-- Name: api_keys_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: plausible
--

ALTER SEQUENCE public.api_keys_id_seq OWNED BY public.api_keys.id;


--
-- Name: check_stats_emails; Type: TABLE; Schema: public; Owner: plausible
--

CREATE TABLE public.check_stats_emails (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    "timestamp" timestamp(0) without time zone
);


ALTER TABLE public.check_stats_emails OWNER TO plausible;

--
-- Name: check_stats_emails_id_seq; Type: SEQUENCE; Schema: public; Owner: plausible
--

CREATE SEQUENCE public.check_stats_emails_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.check_stats_emails_id_seq OWNER TO plausible;

--
-- Name: check_stats_emails_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: plausible
--

ALTER SEQUENCE public.check_stats_emails_id_seq OWNED BY public.check_stats_emails.id;


--
-- Name: create_site_emails; Type: TABLE; Schema: public; Owner: plausible
--

CREATE TABLE public.create_site_emails (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    "timestamp" timestamp(0) without time zone
);


ALTER TABLE public.create_site_emails OWNER TO plausible;

--
-- Name: create_site_emails_id_seq; Type: SEQUENCE; Schema: public; Owner: plausible
--

CREATE SEQUENCE public.create_site_emails_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.create_site_emails_id_seq OWNER TO plausible;

--
-- Name: create_site_emails_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: plausible
--

ALTER SEQUENCE public.create_site_emails_id_seq OWNED BY public.create_site_emails.id;


--
-- Name: custom_domains; Type: TABLE; Schema: public; Owner: plausible
--

CREATE TABLE public.custom_domains (
    id bigint NOT NULL,
    domain text NOT NULL,
    site_id bigint NOT NULL,
    has_ssl_certificate boolean DEFAULT false NOT NULL,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL
);


ALTER TABLE public.custom_domains OWNER TO plausible;

--
-- Name: custom_domains_id_seq; Type: SEQUENCE; Schema: public; Owner: plausible
--

CREATE SEQUENCE public.custom_domains_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.custom_domains_id_seq OWNER TO plausible;

--
-- Name: custom_domains_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: plausible
--

ALTER SEQUENCE public.custom_domains_id_seq OWNED BY public.custom_domains.id;


--
-- Name: email_verification_codes; Type: TABLE; Schema: public; Owner: plausible
--

CREATE TABLE public.email_verification_codes (
    code integer NOT NULL,
    user_id bigint,
    issued_at timestamp(0) without time zone
);


ALTER TABLE public.email_verification_codes OWNER TO plausible;

--
-- Name: enterprise_plans; Type: TABLE; Schema: public; Owner: plausible
--

CREATE TABLE public.enterprise_plans (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    paddle_plan_id character varying(255) NOT NULL,
    billing_interval public.billing_interval NOT NULL,
    monthly_pageview_limit integer NOT NULL,
    hourly_api_request_limit integer NOT NULL,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL,
    site_limit integer NOT NULL
);


ALTER TABLE public.enterprise_plans OWNER TO plausible;

--
-- Name: enterprise_plans_id_seq; Type: SEQUENCE; Schema: public; Owner: plausible
--

CREATE SEQUENCE public.enterprise_plans_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.enterprise_plans_id_seq OWNER TO plausible;

--
-- Name: enterprise_plans_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: plausible
--

ALTER SEQUENCE public.enterprise_plans_id_seq OWNED BY public.enterprise_plans.id;


--
-- Name: feedback_emails; Type: TABLE; Schema: public; Owner: plausible
--

CREATE TABLE public.feedback_emails (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    "timestamp" timestamp(0) without time zone NOT NULL
);


ALTER TABLE public.feedback_emails OWNER TO plausible;

--
-- Name: feedback_emails_id_seq; Type: SEQUENCE; Schema: public; Owner: plausible
--

CREATE SEQUENCE public.feedback_emails_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.feedback_emails_id_seq OWNER TO plausible;

--
-- Name: feedback_emails_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: plausible
--

ALTER SEQUENCE public.feedback_emails_id_seq OWNED BY public.feedback_emails.id;


--
-- Name: fun_with_flags_toggles; Type: TABLE; Schema: public; Owner: plausible
--

CREATE TABLE public.fun_with_flags_toggles (
    id bigint NOT NULL,
    flag_name character varying(255) NOT NULL,
    gate_type character varying(255) NOT NULL,
    target character varying(255) NOT NULL,
    enabled boolean NOT NULL
);


ALTER TABLE public.fun_with_flags_toggles OWNER TO plausible;

--
-- Name: fun_with_flags_toggles_id_seq; Type: SEQUENCE; Schema: public; Owner: plausible
--

CREATE SEQUENCE public.fun_with_flags_toggles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.fun_with_flags_toggles_id_seq OWNER TO plausible;

--
-- Name: fun_with_flags_toggles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: plausible
--

ALTER SEQUENCE public.fun_with_flags_toggles_id_seq OWNED BY public.fun_with_flags_toggles.id;


--
-- Name: goals; Type: TABLE; Schema: public; Owner: plausible
--

CREATE TABLE public.goals (
    id bigint NOT NULL,
    domain text NOT NULL,
    event_name text,
    page_path text,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL
);


ALTER TABLE public.goals OWNER TO plausible;

--
-- Name: goals_id_seq; Type: SEQUENCE; Schema: public; Owner: plausible
--

CREATE SEQUENCE public.goals_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.goals_id_seq OWNER TO plausible;

--
-- Name: goals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: plausible
--

ALTER SEQUENCE public.goals_id_seq OWNED BY public.goals.id;


--
-- Name: google_auth; Type: TABLE; Schema: public; Owner: plausible
--

CREATE TABLE public.google_auth (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    email character varying(255) NOT NULL,
    refresh_token character varying(255) NOT NULL,
    access_token character varying(255) NOT NULL,
    expires timestamp(0) without time zone NOT NULL,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL,
    site_id bigint NOT NULL,
    property text
);


ALTER TABLE public.google_auth OWNER TO plausible;

--
-- Name: google_auth_id_seq; Type: SEQUENCE; Schema: public; Owner: plausible
--

CREATE SEQUENCE public.google_auth_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.google_auth_id_seq OWNER TO plausible;

--
-- Name: google_auth_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: plausible
--

ALTER SEQUENCE public.google_auth_id_seq OWNED BY public.google_auth.id;


--
-- Name: intro_emails; Type: TABLE; Schema: public; Owner: plausible
--

CREATE TABLE public.intro_emails (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    "timestamp" timestamp(0) without time zone
);


ALTER TABLE public.intro_emails OWNER TO plausible;

--
-- Name: intro_emails_id_seq; Type: SEQUENCE; Schema: public; Owner: plausible
--

CREATE SEQUENCE public.intro_emails_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.intro_emails_id_seq OWNER TO plausible;

--
-- Name: intro_emails_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: plausible
--

ALTER SEQUENCE public.intro_emails_id_seq OWNED BY public.intro_emails.id;


--
-- Name: invitations; Type: TABLE; Schema: public; Owner: plausible
--

CREATE TABLE public.invitations (
    id bigint NOT NULL,
    email public.citext NOT NULL,
    site_id bigint NOT NULL,
    inviter_id bigint NOT NULL,
    role public.site_membership_role NOT NULL,
    invitation_id character varying(255),
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL
);


ALTER TABLE public.invitations OWNER TO plausible;

--
-- Name: invitations_id_seq; Type: SEQUENCE; Schema: public; Owner: plausible
--

CREATE SEQUENCE public.invitations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.invitations_id_seq OWNER TO plausible;

--
-- Name: invitations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: plausible
--

ALTER SEQUENCE public.invitations_id_seq OWNED BY public.invitations.id;


--
-- Name: monthly_reports; Type: TABLE; Schema: public; Owner: plausible
--

CREATE TABLE public.monthly_reports (
    id bigint NOT NULL,
    site_id bigint NOT NULL,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL,
    recipients public.citext[] DEFAULT ARRAY[]::public.citext[] NOT NULL
);


ALTER TABLE public.monthly_reports OWNER TO plausible;

--
-- Name: monthly_reports_id_seq; Type: SEQUENCE; Schema: public; Owner: plausible
--

CREATE SEQUENCE public.monthly_reports_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.monthly_reports_id_seq OWNER TO plausible;

--
-- Name: monthly_reports_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: plausible
--

ALTER SEQUENCE public.monthly_reports_id_seq OWNED BY public.monthly_reports.id;


--
-- Name: oban_jobs; Type: TABLE; Schema: public; Owner: plausible
--

CREATE TABLE public.oban_jobs (
    id bigint NOT NULL,
    state public.oban_job_state DEFAULT 'available'::public.oban_job_state NOT NULL,
    queue text DEFAULT 'default'::text NOT NULL,
    worker text NOT NULL,
    args jsonb DEFAULT '{}'::jsonb NOT NULL,
    errors jsonb[] DEFAULT ARRAY[]::jsonb[] NOT NULL,
    attempt integer DEFAULT 0 NOT NULL,
    max_attempts integer DEFAULT 20 NOT NULL,
    inserted_at timestamp without time zone DEFAULT timezone('UTC'::text, now()) NOT NULL,
    scheduled_at timestamp without time zone DEFAULT timezone('UTC'::text, now()) NOT NULL,
    attempted_at timestamp without time zone,
    completed_at timestamp without time zone,
    attempted_by text[],
    discarded_at timestamp without time zone,
    priority integer DEFAULT 0 NOT NULL,
    tags character varying(255)[] DEFAULT ARRAY[]::character varying[],
    meta jsonb DEFAULT '{}'::jsonb,
    cancelled_at timestamp without time zone,
    CONSTRAINT attempt_range CHECK (((attempt >= 0) AND (attempt <= max_attempts))),
    CONSTRAINT positive_max_attempts CHECK ((max_attempts > 0)),
    CONSTRAINT priority_range CHECK (((priority >= 0) AND (priority <= 3))),
    CONSTRAINT queue_length CHECK (((char_length(queue) > 0) AND (char_length(queue) < 128))),
    CONSTRAINT worker_length CHECK (((char_length(worker) > 0) AND (char_length(worker) < 128)))
);


ALTER TABLE public.oban_jobs OWNER TO plausible;

--
-- Name: TABLE oban_jobs; Type: COMMENT; Schema: public; Owner: plausible
--

COMMENT ON TABLE public.oban_jobs IS '11';


--
-- Name: oban_jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: plausible
--

CREATE SEQUENCE public.oban_jobs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.oban_jobs_id_seq OWNER TO plausible;

--
-- Name: oban_jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: plausible
--

ALTER SEQUENCE public.oban_jobs_id_seq OWNED BY public.oban_jobs.id;


--
-- Name: oban_peers; Type: TABLE; Schema: public; Owner: plausible
--

CREATE UNLOGGED TABLE public.oban_peers (
    name text NOT NULL,
    node text NOT NULL,
    started_at timestamp without time zone NOT NULL,
    expires_at timestamp without time zone NOT NULL
);


ALTER TABLE public.oban_peers OWNER TO plausible;

--
-- Name: salts; Type: TABLE; Schema: public; Owner: plausible
--

CREATE TABLE public.salts (
    id bigint NOT NULL,
    salt bytea NOT NULL,
    inserted_at timestamp(0) without time zone NOT NULL
);


ALTER TABLE public.salts OWNER TO plausible;

--
-- Name: salts_id_seq; Type: SEQUENCE; Schema: public; Owner: plausible
--

CREATE SEQUENCE public.salts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.salts_id_seq OWNER TO plausible;

--
-- Name: salts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: plausible
--

ALTER SEQUENCE public.salts_id_seq OWNED BY public.salts.id;


--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: plausible
--

CREATE TABLE public.schema_migrations (
    version bigint NOT NULL,
    inserted_at timestamp(0) without time zone
);


ALTER TABLE public.schema_migrations OWNER TO plausible;

--
-- Name: sent_monthly_reports; Type: TABLE; Schema: public; Owner: plausible
--

CREATE TABLE public.sent_monthly_reports (
    id bigint NOT NULL,
    site_id bigint NOT NULL,
    year integer NOT NULL,
    month integer NOT NULL,
    "timestamp" timestamp(0) without time zone
);


ALTER TABLE public.sent_monthly_reports OWNER TO plausible;

--
-- Name: sent_monthly_reports_id_seq; Type: SEQUENCE; Schema: public; Owner: plausible
--

CREATE SEQUENCE public.sent_monthly_reports_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sent_monthly_reports_id_seq OWNER TO plausible;

--
-- Name: sent_monthly_reports_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: plausible
--

ALTER SEQUENCE public.sent_monthly_reports_id_seq OWNED BY public.sent_monthly_reports.id;


--
-- Name: sent_renewal_notifications; Type: TABLE; Schema: public; Owner: plausible
--

CREATE TABLE public.sent_renewal_notifications (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    "timestamp" timestamp(0) without time zone
);


ALTER TABLE public.sent_renewal_notifications OWNER TO plausible;

--
-- Name: sent_renewal_notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: plausible
--

CREATE SEQUENCE public.sent_renewal_notifications_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sent_renewal_notifications_id_seq OWNER TO plausible;

--
-- Name: sent_renewal_notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: plausible
--

ALTER SEQUENCE public.sent_renewal_notifications_id_seq OWNED BY public.sent_renewal_notifications.id;


--
-- Name: sent_weekly_reports; Type: TABLE; Schema: public; Owner: plausible
--

CREATE TABLE public.sent_weekly_reports (
    id bigint NOT NULL,
    site_id bigint NOT NULL,
    year integer,
    week integer,
    "timestamp" timestamp(0) without time zone
);


ALTER TABLE public.sent_weekly_reports OWNER TO plausible;

--
-- Name: sent_weekly_reports_id_seq; Type: SEQUENCE; Schema: public; Owner: plausible
--

CREATE SEQUENCE public.sent_weekly_reports_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sent_weekly_reports_id_seq OWNER TO plausible;

--
-- Name: sent_weekly_reports_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: plausible
--

ALTER SEQUENCE public.sent_weekly_reports_id_seq OWNED BY public.sent_weekly_reports.id;


--
-- Name: setup_help_emails; Type: TABLE; Schema: public; Owner: plausible
--

CREATE TABLE public.setup_help_emails (
    id bigint NOT NULL,
    site_id bigint NOT NULL,
    "timestamp" timestamp(0) without time zone
);


ALTER TABLE public.setup_help_emails OWNER TO plausible;

--
-- Name: setup_help_emails_id_seq; Type: SEQUENCE; Schema: public; Owner: plausible
--

CREATE SEQUENCE public.setup_help_emails_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.setup_help_emails_id_seq OWNER TO plausible;

--
-- Name: setup_help_emails_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: plausible
--

ALTER SEQUENCE public.setup_help_emails_id_seq OWNED BY public.setup_help_emails.id;


--
-- Name: setup_success_emails; Type: TABLE; Schema: public; Owner: plausible
--

CREATE TABLE public.setup_success_emails (
    id bigint NOT NULL,
    site_id bigint NOT NULL,
    "timestamp" timestamp(0) without time zone
);


ALTER TABLE public.setup_success_emails OWNER TO plausible;

--
-- Name: setup_success_emails_id_seq; Type: SEQUENCE; Schema: public; Owner: plausible
--

CREATE SEQUENCE public.setup_success_emails_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.setup_success_emails_id_seq OWNER TO plausible;

--
-- Name: setup_success_emails_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: plausible
--

ALTER SEQUENCE public.setup_success_emails_id_seq OWNED BY public.setup_success_emails.id;


--
-- Name: shared_links; Type: TABLE; Schema: public; Owner: plausible
--

CREATE TABLE public.shared_links (
    id bigint NOT NULL,
    site_id bigint NOT NULL,
    slug character varying(255) NOT NULL,
    password_hash character varying(255),
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL,
    name character varying(255) NOT NULL
);


ALTER TABLE public.shared_links OWNER TO plausible;

--
-- Name: shared_links_id_seq; Type: SEQUENCE; Schema: public; Owner: plausible
--

CREATE SEQUENCE public.shared_links_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.shared_links_id_seq OWNER TO plausible;

--
-- Name: shared_links_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: plausible
--

ALTER SEQUENCE public.shared_links_id_seq OWNED BY public.shared_links.id;


--
-- Name: site_memberships; Type: TABLE; Schema: public; Owner: plausible
--

CREATE TABLE public.site_memberships (
    id bigint NOT NULL,
    site_id bigint NOT NULL,
    user_id bigint NOT NULL,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL,
    role public.site_membership_role DEFAULT 'owner'::public.site_membership_role NOT NULL
);


ALTER TABLE public.site_memberships OWNER TO plausible;

--
-- Name: site_memberships_id_seq; Type: SEQUENCE; Schema: public; Owner: plausible
--

CREATE SEQUENCE public.site_memberships_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.site_memberships_id_seq OWNER TO plausible;

--
-- Name: site_memberships_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: plausible
--

ALTER SEQUENCE public.site_memberships_id_seq OWNED BY public.site_memberships.id;


--
-- Name: sites; Type: TABLE; Schema: public; Owner: plausible
--

CREATE TABLE public.sites (
    id bigint NOT NULL,
    domain character varying(255) NOT NULL,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL,
    timezone character varying(255) NOT NULL,
    public boolean DEFAULT false NOT NULL,
    locked boolean DEFAULT false NOT NULL,
    has_stats boolean DEFAULT false NOT NULL,
    imported_data jsonb,
    stats_start_date date
);


ALTER TABLE public.sites OWNER TO plausible;

--
-- Name: sites_id_seq; Type: SEQUENCE; Schema: public; Owner: plausible
--

CREATE SEQUENCE public.sites_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sites_id_seq OWNER TO plausible;

--
-- Name: sites_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: plausible
--

ALTER SEQUENCE public.sites_id_seq OWNED BY public.sites.id;


--
-- Name: spike_notifications; Type: TABLE; Schema: public; Owner: plausible
--

CREATE TABLE public.spike_notifications (
    id bigint NOT NULL,
    site_id bigint NOT NULL,
    threshold integer NOT NULL,
    last_sent timestamp(0) without time zone,
    recipients public.citext[] DEFAULT ARRAY[]::public.citext[] NOT NULL,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL
);


ALTER TABLE public.spike_notifications OWNER TO plausible;

--
-- Name: spike_notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: plausible
--

CREATE SEQUENCE public.spike_notifications_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.spike_notifications_id_seq OWNER TO plausible;

--
-- Name: spike_notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: plausible
--

ALTER SEQUENCE public.spike_notifications_id_seq OWNED BY public.spike_notifications.id;


--
-- Name: subscriptions; Type: TABLE; Schema: public; Owner: plausible
--

CREATE TABLE public.subscriptions (
    id bigint NOT NULL,
    paddle_subscription_id character varying(255),
    paddle_plan_id character varying(255) NOT NULL,
    user_id bigint NOT NULL,
    update_url text,
    cancel_url text,
    status character varying(255) NOT NULL,
    next_bill_amount character varying(255) NOT NULL,
    next_bill_date date,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL,
    last_bill_date date,
    currency_code character varying(255) NOT NULL
);


ALTER TABLE public.subscriptions OWNER TO plausible;

--
-- Name: subscriptions_id_seq; Type: SEQUENCE; Schema: public; Owner: plausible
--

CREATE SEQUENCE public.subscriptions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.subscriptions_id_seq OWNER TO plausible;

--
-- Name: subscriptions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: plausible
--

ALTER SEQUENCE public.subscriptions_id_seq OWNED BY public.subscriptions.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: plausible
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    email public.citext NOT NULL,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL,
    name character varying(255),
    last_seen timestamp(0) without time zone DEFAULT now(),
    password_hash character varying(255),
    trial_expiry_date date,
    email_verified boolean DEFAULT false NOT NULL,
    theme character varying(255) DEFAULT 'system'::character varying,
    grace_period jsonb
);


ALTER TABLE public.users OWNER TO plausible;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: plausible
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO plausible;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: plausible
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: weekly_reports; Type: TABLE; Schema: public; Owner: plausible
--

CREATE TABLE public.weekly_reports (
    id bigint NOT NULL,
    site_id bigint NOT NULL,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL,
    recipients public.citext[] DEFAULT ARRAY[]::public.citext[] NOT NULL
);


ALTER TABLE public.weekly_reports OWNER TO plausible;

--
-- Name: weekly_reports_id_seq; Type: SEQUENCE; Schema: public; Owner: plausible
--

CREATE SEQUENCE public.weekly_reports_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.weekly_reports_id_seq OWNER TO plausible;

--
-- Name: weekly_reports_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: plausible
--

ALTER SEQUENCE public.weekly_reports_id_seq OWNED BY public.weekly_reports.id;


--
-- Name: api_keys id; Type: DEFAULT; Schema: public; Owner: plausible
--

ALTER TABLE ONLY public.api_keys ALTER COLUMN id SET DEFAULT nextval('public.api_keys_id_seq'::regclass);


--
-- Name: check_stats_emails id; Type: DEFAULT; Schema: public; Owner: plausible
--

ALTER TABLE ONLY public.check_stats_emails ALTER COLUMN id SET DEFAULT nextval('public.check_stats_emails_id_seq'::regclass);


--
-- Name: create_site_emails id; Type: DEFAULT; Schema: public; Owner: plausible
--

ALTER TABLE ONLY public.create_site_emails ALTER COLUMN id SET DEFAULT nextval('public.create_site_emails_id_seq'::regclass);


--
-- Name: custom_domains id; Type: DEFAULT; Schema: public; Owner: plausible
--

ALTER TABLE ONLY public.custom_domains ALTER COLUMN id SET DEFAULT nextval('public.custom_domains_id_seq'::regclass);


--
-- Name: enterprise_plans id; Type: DEFAULT; Schema: public; Owner: plausible
--

ALTER TABLE ONLY public.enterprise_plans ALTER COLUMN id SET DEFAULT nextval('public.enterprise_plans_id_seq'::regclass);


--
-- Name: feedback_emails id; Type: DEFAULT; Schema: public; Owner: plausible
--

ALTER TABLE ONLY public.feedback_emails ALTER COLUMN id SET DEFAULT nextval('public.feedback_emails_id_seq'::regclass);


--
-- Name: fun_with_flags_toggles id; Type: DEFAULT; Schema: public; Owner: plausible
--

ALTER TABLE ONLY public.fun_with_flags_toggles ALTER COLUMN id SET DEFAULT nextval('public.fun_with_flags_toggles_id_seq'::regclass);


--
-- Name: goals id; Type: DEFAULT; Schema: public; Owner: plausible
--

ALTER TABLE ONLY public.goals ALTER COLUMN id SET DEFAULT nextval('public.goals_id_seq'::regclass);


--
-- Name: google_auth id; Type: DEFAULT; Schema: public; Owner: plausible
--

ALTER TABLE ONLY public.google_auth ALTER COLUMN id SET DEFAULT nextval('public.google_auth_id_seq'::regclass);


--
-- Name: intro_emails id; Type: DEFAULT; Schema: public; Owner: plausible
--

ALTER TABLE ONLY public.intro_emails ALTER COLUMN id SET DEFAULT nextval('public.intro_emails_id_seq'::regclass);


--
-- Name: invitations id; Type: DEFAULT; Schema: public; Owner: plausible
--

ALTER TABLE ONLY public.invitations ALTER COLUMN id SET DEFAULT nextval('public.invitations_id_seq'::regclass);


--
-- Name: monthly_reports id; Type: DEFAULT; Schema: public; Owner: plausible
--

ALTER TABLE ONLY public.monthly_reports ALTER COLUMN id SET DEFAULT nextval('public.monthly_reports_id_seq'::regclass);


--
-- Name: oban_jobs id; Type: DEFAULT; Schema: public; Owner: plausible
--

ALTER TABLE ONLY public.oban_jobs ALTER COLUMN id SET DEFAULT nextval('public.oban_jobs_id_seq'::regclass);


--
-- Name: salts id; Type: DEFAULT; Schema: public; Owner: plausible
--

ALTER TABLE ONLY public.salts ALTER COLUMN id SET DEFAULT nextval('public.salts_id_seq'::regclass);


--
-- Name: sent_monthly_reports id; Type: DEFAULT; Schema: public; Owner: plausible
--

ALTER TABLE ONLY public.sent_monthly_reports ALTER COLUMN id SET DEFAULT nextval('public.sent_monthly_reports_id_seq'::regclass);


--
-- Name: sent_renewal_notifications id; Type: DEFAULT; Schema: public; Owner: plausible
--

ALTER TABLE ONLY public.sent_renewal_notifications ALTER COLUMN id SET DEFAULT nextval('public.sent_renewal_notifications_id_seq'::regclass);


--
-- Name: sent_weekly_reports id; Type: DEFAULT; Schema: public; Owner: plausible
--

ALTER TABLE ONLY public.sent_weekly_reports ALTER COLUMN id SET DEFAULT nextval('public.sent_weekly_reports_id_seq'::regclass);


--
-- Name: setup_help_emails id; Type: DEFAULT; Schema: public; Owner: plausible
--

ALTER TABLE ONLY public.setup_help_emails ALTER COLUMN id SET DEFAULT nextval('public.setup_help_emails_id_seq'::regclass);


--
-- Name: setup_success_emails id; Type: DEFAULT; Schema: public; Owner: plausible
--

ALTER TABLE ONLY public.setup_success_emails ALTER COLUMN id SET DEFAULT nextval('public.setup_success_emails_id_seq'::regclass);


--
-- Name: shared_links id; Type: DEFAULT; Schema: public; Owner: plausible
--

ALTER TABLE ONLY public.shared_links ALTER COLUMN id SET DEFAULT nextval('public.shared_links_id_seq'::regclass);


--
-- Name: site_memberships id; Type: DEFAULT; Schema: public; Owner: plausible
--

ALTER TABLE ONLY public.site_memberships ALTER COLUMN id SET DEFAULT nextval('public.site_memberships_id_seq'::regclass);


--
-- Name: sites id; Type: DEFAULT; Schema: public; Owner: plausible
--

ALTER TABLE ONLY public.sites ALTER COLUMN id SET DEFAULT nextval('public.sites_id_seq'::regclass);


--
-- Name: spike_notifications id; Type: DEFAULT; Schema: public; Owner: plausible
--

ALTER TABLE ONLY public.spike_notifications ALTER COLUMN id SET DEFAULT nextval('public.spike_notifications_id_seq'::regclass);


--
-- Name: subscriptions id; Type: DEFAULT; Schema: public; Owner: plausible
--

ALTER TABLE ONLY public.subscriptions ALTER COLUMN id SET DEFAULT nextval('public.subscriptions_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: plausible
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: weekly_reports id; Type: DEFAULT; Schema: public; Owner: plausible
--

ALTER TABLE ONLY public.weekly_reports ALTER COLUMN id SET DEFAULT nextval('public.weekly_reports_id_seq'::regclass);


--
-- Data for Name: api_keys; Type: TABLE DATA; Schema: public; Owner: plausible
--

COPY public.api_keys (id, user_id, name, key_prefix, key_hash, inserted_at, updated_at, scopes, hourly_request_limit) FROM stdin;
\.


--
-- Data for Name: check_stats_emails; Type: TABLE DATA; Schema: public; Owner: plausible
--

COPY public.check_stats_emails (id, user_id, "timestamp") FROM stdin;
\.


--
-- Data for Name: create_site_emails; Type: TABLE DATA; Schema: public; Owner: plausible
--

COPY public.create_site_emails (id, user_id, "timestamp") FROM stdin;
\.


--
-- Data for Name: custom_domains; Type: TABLE DATA; Schema: public; Owner: plausible
--

COPY public.custom_domains (id, domain, site_id, has_ssl_certificate, inserted_at, updated_at) FROM stdin;
\.


--
-- Data for Name: email_verification_codes; Type: TABLE DATA; Schema: public; Owner: plausible
--

COPY public.email_verification_codes (code, user_id, issued_at) FROM stdin;
9381	\N	\N
4747	\N	\N
6257	\N	\N
5484	\N	\N
2929	\N	\N
4203	\N	\N
2717	\N	\N
8547	\N	\N
5490	\N	\N
4851	\N	\N
5005	\N	\N
2477	\N	\N
2409	\N	\N
2013	\N	\N
5217	\N	\N
6428	\N	\N
4382	\N	\N
8603	\N	\N
5764	\N	\N
9974	\N	\N
4929	\N	\N
1091	\N	\N
9242	\N	\N
5594	\N	\N
2112	\N	\N
7493	\N	\N
5778	\N	\N
6862	\N	\N
7256	\N	\N
3036	\N	\N
3294	\N	\N
6774	\N	\N
2189	\N	\N
2808	\N	\N
6934	\N	\N
3785	\N	\N
5004	\N	\N
1692	\N	\N
6751	\N	\N
8592	\N	\N
2270	\N	\N
6505	\N	\N
4927	\N	\N
3326	\N	\N
7756	\N	\N
6968	\N	\N
1132	\N	\N
9156	\N	\N
2278	\N	\N
9109	\N	\N
5345	\N	\N
7801	\N	\N
8625	\N	\N
8671	\N	\N
2787	\N	\N
9490	\N	\N
6663	\N	\N
1727	\N	\N
3127	\N	\N
7551	\N	\N
9928	\N	\N
7078	\N	\N
2323	\N	\N
4655	\N	\N
4410	\N	\N
5856	\N	\N
1658	\N	\N
4136	\N	\N
9846	\N	\N
5124	\N	\N
2086	\N	\N
4759	\N	\N
5795	\N	\N
5642	\N	\N
9844	\N	\N
1684	\N	\N
7402	\N	\N
4475	\N	\N
8911	\N	\N
4406	\N	\N
5193	\N	\N
8968	\N	\N
7738	\N	\N
4201	\N	\N
5909	\N	\N
2031	\N	\N
7661	\N	\N
3894	\N	\N
7773	\N	\N
5438	\N	\N
5528	\N	\N
6162	\N	\N
9283	\N	\N
9938	\N	\N
8824	\N	\N
9576	\N	\N
1948	\N	\N
5453	\N	\N
5593	\N	\N
3702	\N	\N
5177	\N	\N
4043	\N	\N
2910	\N	\N
9248	\N	\N
2349	\N	\N
3795	\N	\N
5131	\N	\N
7054	\N	\N
1128	\N	\N
6652	\N	\N
1864	\N	\N
3699	\N	\N
1014	\N	\N
6917	\N	\N
5905	\N	\N
4291	\N	\N
3303	\N	\N
3290	\N	\N
4899	\N	\N
1937	\N	\N
4086	\N	\N
1915	\N	\N
5382	\N	\N
4128	\N	\N
5801	\N	\N
7027	\N	\N
7334	\N	\N
1912	\N	\N
1263	\N	\N
5027	\N	\N
9924	\N	\N
5072	\N	\N
2812	\N	\N
3142	\N	\N
9222	\N	\N
7631	\N	\N
7133	\N	\N
8196	\N	\N
7841	\N	\N
2453	\N	\N
1357	\N	\N
8583	\N	\N
7092	\N	\N
2987	\N	\N
2098	\N	\N
3448	\N	\N
8505	\N	\N
4692	\N	\N
4243	\N	\N
6139	\N	\N
4887	\N	\N
1975	\N	\N
7061	\N	\N
7671	\N	\N
7371	\N	\N
8007	\N	\N
5557	\N	\N
7688	\N	\N
5734	\N	\N
9631	\N	\N
8011	\N	\N
9687	\N	\N
8404	\N	\N
1752	\N	\N
3090	\N	\N
5289	\N	\N
8342	\N	\N
9343	\N	\N
7928	\N	\N
8896	\N	\N
3574	\N	\N
5942	\N	\N
1331	\N	\N
3456	\N	\N
1333	\N	\N
1055	\N	\N
1977	\N	\N
9003	\N	\N
1447	\N	\N
6984	\N	\N
8794	\N	\N
8606	\N	\N
2832	\N	\N
9499	\N	\N
3899	\N	\N
9373	\N	\N
6176	\N	\N
1767	\N	\N
8700	\N	\N
2790	\N	\N
4334	\N	\N
1372	\N	\N
2913	\N	\N
7147	\N	\N
9383	\N	\N
5290	\N	\N
7727	\N	\N
7931	\N	\N
3493	\N	\N
6839	\N	\N
9845	\N	\N
1122	\N	\N
5348	\N	\N
7261	\N	\N
9991	\N	\N
9064	\N	\N
1791	\N	\N
4247	\N	\N
5221	\N	\N
4267	\N	\N
6498	\N	\N
3823	\N	\N
5743	\N	\N
1506	\N	\N
2725	\N	\N
9049	\N	\N
1710	\N	\N
9574	\N	\N
9069	\N	\N
6131	\N	\N
6117	\N	\N
2640	\N	\N
4663	\N	\N
7630	\N	\N
5225	\N	\N
3101	\N	\N
9386	\N	\N
2814	\N	\N
7617	\N	\N
4690	\N	\N
8679	\N	\N
4034	\N	\N
5719	\N	\N
2734	\N	\N
7764	\N	\N
5819	\N	\N
7692	\N	\N
9871	\N	\N
4115	\N	\N
3658	\N	\N
6011	\N	\N
4071	\N	\N
7919	\N	\N
6142	\N	\N
3404	\N	\N
5921	\N	\N
6668	\N	\N
5272	\N	\N
9389	\N	\N
8138	\N	\N
3669	\N	\N
4966	\N	\N
1966	\N	\N
5804	\N	\N
2420	\N	\N
5696	\N	\N
7945	\N	\N
1249	\N	\N
2801	\N	\N
8855	\N	\N
5148	\N	\N
7574	\N	\N
6618	\N	\N
2899	\N	\N
8170	\N	\N
1992	\N	\N
3321	\N	\N
7224	\N	\N
7523	\N	\N
8747	\N	\N
6405	\N	\N
6188	\N	\N
8758	\N	\N
7998	\N	\N
6593	\N	\N
2220	\N	\N
4320	\N	\N
9285	\N	\N
7698	\N	\N
7356	\N	\N
7277	\N	\N
7750	\N	\N
2710	\N	\N
6382	\N	\N
7687	\N	\N
1552	\N	\N
7418	\N	\N
1629	\N	\N
7971	\N	\N
4249	\N	\N
2130	\N	\N
4785	\N	\N
9940	\N	\N
7439	\N	\N
5735	\N	\N
6388	\N	\N
7827	\N	\N
5570	\N	\N
6439	\N	\N
4909	\N	\N
2925	\N	\N
4457	\N	\N
2590	\N	\N
6515	\N	\N
4347	\N	\N
3172	\N	\N
8614	\N	\N
1946	\N	\N
4042	\N	\N
2002	\N	\N
9590	\N	\N
9622	\N	\N
9973	\N	\N
4313	\N	\N
4141	\N	\N
8307	\N	\N
4607	\N	\N
1719	\N	\N
7996	\N	\N
3031	\N	\N
6779	\N	\N
4116	\N	\N
9667	\N	\N
8088	\N	\N
9734	\N	\N
4157	\N	\N
3550	\N	\N
5011	\N	\N
9078	\N	\N
3651	\N	\N
1532	\N	\N
1167	\N	\N
9483	\N	\N
5230	\N	\N
2452	\N	\N
7087	\N	\N
9531	\N	\N
3495	\N	\N
3041	\N	\N
1862	\N	\N
9956	\N	\N
2827	\N	\N
7857	\N	\N
9392	\N	\N
6821	\N	\N
3309	\N	\N
6686	\N	\N
5576	\N	\N
3761	\N	\N
7752	\N	\N
8162	\N	\N
5215	\N	\N
7626	\N	\N
2815	\N	\N
6394	\N	\N
2549	\N	\N
5857	\N	\N
7468	\N	\N
8134	\N	\N
2234	\N	\N
9657	\N	\N
3763	\N	\N
1681	\N	\N
2732	\N	\N
5894	\N	\N
7933	\N	\N
4126	\N	\N
9256	\N	\N
9851	\N	\N
1421	\N	\N
5169	\N	\N
6870	\N	\N
1369	\N	\N
7659	\N	\N
4079	\N	\N
6861	\N	\N
6034	\N	\N
2401	\N	\N
4374	\N	\N
1810	\N	\N
5888	\N	\N
6399	\N	\N
9188	\N	\N
2931	\N	\N
1052	\N	\N
6546	\N	\N
5505	\N	\N
1636	\N	\N
9224	\N	\N
7039	\N	\N
2159	\N	\N
6044	\N	\N
9595	\N	\N
3212	\N	\N
4948	\N	\N
1661	\N	\N
6075	\N	\N
5984	\N	\N
6495	\N	\N
1758	\N	\N
7796	\N	\N
3034	\N	\N
1771	\N	\N
9985	\N	\N
2716	\N	\N
5890	\N	\N
9218	\N	\N
3214	\N	\N
1223	\N	\N
7002	\N	\N
9399	\N	\N
3584	\N	\N
7286	\N	\N
5147	\N	\N
1600	\N	\N
7083	\N	\N
6633	\N	\N
6763	\N	\N
3667	\N	\N
1619	\N	\N
9391	\N	\N
2186	\N	\N
4460	\N	\N
2841	\N	\N
7247	\N	\N
7613	\N	\N
9984	\N	\N
9564	\N	\N
8262	\N	\N
1126	\N	\N
6118	\N	\N
8034	\N	\N
1730	\N	\N
6844	\N	\N
9066	\N	\N
7288	\N	\N
8387	\N	\N
3599	\N	\N
9521	\N	\N
6378	\N	\N
1656	\N	\N
7031	\N	\N
4900	\N	\N
4187	\N	\N
1595	\N	\N
3491	\N	\N
6014	\N	\N
1188	\N	\N
6200	\N	\N
8948	\N	\N
6963	\N	\N
9948	\N	\N
8113	\N	\N
9110	\N	\N
3662	\N	\N
1724	\N	\N
1229	\N	\N
9585	\N	\N
7105	\N	\N
9229	\N	\N
8478	\N	\N
5477	\N	\N
4753	\N	\N
7362	\N	\N
9672	\N	\N
7835	\N	\N
4813	\N	\N
2356	\N	\N
5276	\N	\N
9473	\N	\N
8392	\N	\N
9149	\N	\N
4882	\N	\N
7132	\N	\N
5683	\N	\N
7968	\N	\N
9659	\N	\N
5278	\N	\N
3372	\N	\N
8226	\N	\N
6813	\N	\N
1261	\N	\N
9549	\N	\N
6991	\N	\N
9755	\N	\N
9926	\N	\N
1918	\N	\N
8491	\N	\N
7737	\N	\N
5080	\N	\N
1256	\N	\N
5303	\N	\N
1994	\N	\N
2880	\N	\N
9164	\N	\N
8974	\N	\N
8668	\N	\N
6196	\N	\N
8449	\N	\N
8158	\N	\N
5415	\N	\N
8125	\N	\N
8829	\N	\N
7269	\N	\N
9981	\N	\N
9528	\N	\N
2908	\N	\N
9344	\N	\N
3958	\N	\N
4890	\N	\N
1248	\N	\N
8055	\N	\N
9413	\N	\N
8715	\N	\N
9886	\N	\N
9887	\N	\N
5013	\N	\N
6063	\N	\N
4182	\N	\N
4309	\N	\N
7667	\N	\N
8972	\N	\N
7139	\N	\N
8756	\N	\N
4057	\N	\N
2688	\N	\N
3094	\N	\N
4908	\N	\N
4847	\N	\N
8660	\N	\N
5095	\N	\N
6007	\N	\N
6711	\N	\N
9394	\N	\N
2252	\N	\N
3410	\N	\N
2436	\N	\N
7588	\N	\N
2506	\N	\N
2029	\N	\N
2655	\N	\N
7188	\N	\N
5306	\N	\N
1253	\N	\N
5361	\N	\N
5728	\N	\N
2397	\N	\N
3440	\N	\N
7952	\N	\N
1041	\N	\N
3234	\N	\N
3004	\N	\N
9210	\N	\N
5721	\N	\N
1602	\N	\N
7628	\N	\N
3204	\N	\N
5104	\N	\N
5668	\N	\N
3194	\N	\N
7342	\N	\N
7948	\N	\N
6482	\N	\N
3009	\N	\N
4769	\N	\N
1096	\N	\N
9315	\N	\N
7887	\N	\N
8683	\N	\N
5006	\N	\N
4390	\N	\N
6636	\N	\N
8217	\N	\N
2217	\N	\N
8536	\N	\N
4533	\N	\N
6067	\N	\N
8670	\N	\N
3165	\N	\N
2746	\N	\N
1313	\N	\N
6387	\N	\N
4518	\N	\N
5152	\N	\N
2579	\N	\N
7889	\N	\N
9781	\N	\N
5989	\N	\N
1154	\N	\N
7255	\N	\N
4780	\N	\N
6487	\N	\N
1972	\N	\N
6832	\N	\N
1682	\N	\N
3891	\N	\N
3322	\N	\N
9807	\N	\N
6167	\N	\N
2874	\N	\N
8108	\N	\N
6346	\N	\N
9866	\N	\N
3378	\N	\N
6947	\N	\N
5062	\N	\N
4487	\N	\N
7400	\N	\N
8285	\N	\N
9159	\N	\N
9964	\N	\N
8381	\N	\N
5675	\N	\N
9446	\N	\N
5372	\N	\N
6098	\N	\N
8189	\N	\N
6130	\N	\N
8624	\N	\N
4760	\N	\N
3243	\N	\N
7235	\N	\N
1949	\N	\N
7717	\N	\N
7988	\N	\N
3682	\N	\N
4000	\N	\N
3888	\N	\N
5283	\N	\N
9982	\N	\N
7673	\N	\N
9917	\N	\N
1285	\N	\N
4054	\N	\N
2937	\N	\N
5184	\N	\N
4649	\N	\N
8044	\N	\N
9722	\N	\N
8332	\N	\N
1324	\N	\N
4741	\N	\N
7694	\N	\N
2111	\N	\N
4470	\N	\N
4080	\N	\N
3997	\N	\N
1444	\N	\N
4722	\N	\N
1466	\N	\N
1283	\N	\N
1366	\N	\N
7770	\N	\N
7480	\N	\N
2211	\N	\N
2907	\N	\N
2690	\N	\N
6700	\N	\N
4378	\N	\N
9688	\N	\N
5309	\N	\N
9663	\N	\N
1048	\N	\N
9231	\N	\N
4191	\N	\N
4995	\N	\N
1780	\N	\N
3554	\N	\N
4757	\N	\N
1850	\N	\N
3515	\N	\N
7120	\N	\N
9827	\N	\N
6276	\N	\N
9158	\N	\N
5866	\N	\N
3937	\N	\N
7487	\N	\N
1579	\N	\N
9534	\N	\N
7052	\N	\N
9339	\N	\N
9340	\N	\N
9555	\N	\N
1605	\N	\N
8369	\N	\N
2784	\N	\N
4814	\N	\N
1293	\N	\N
7465	\N	\N
2432	\N	\N
2912	\N	\N
8255	\N	\N
1963	\N	\N
5670	\N	\N
4650	\N	\N
2870	\N	\N
7117	\N	\N
7758	\N	\N
9324	\N	\N
3808	\N	\N
3015	\N	\N
6904	\N	\N
9245	\N	\N
7335	\N	\N
6705	\N	\N
7718	\N	\N
3217	\N	\N
1480	\N	\N
4122	\N	\N
6594	\N	\N
9498	\N	\N
9629	\N	\N
7903	\N	\N
2826	\N	\N
7355	\N	\N
2298	\N	\N
1561	\N	\N
2909	\N	\N
7787	\N	\N
4322	\N	\N
1545	\N	\N
7497	\N	\N
3841	\N	\N
1855	\N	\N
8919	\N	\N
5556	\N	\N
9674	\N	\N
9235	\N	\N
9515	\N	\N
7683	\N	\N
4842	\N	\N
6319	\N	\N
5653	\N	\N
7442	\N	\N
8705	\N	\N
2163	\N	\N
6548	\N	\N
3553	\N	\N
6393	\N	\N
1834	\N	\N
4083	\N	\N
8902	\N	\N
8344	\N	\N
1084	\N	\N
2984	\N	\N
6551	\N	\N
2132	\N	\N
8198	\N	\N
2530	\N	\N
9650	\N	\N
7267	\N	\N
1455	\N	\N
4656	\N	\N
8179	\N	\N
9102	\N	\N
5544	\N	\N
5454	\N	\N
5815	\N	\N
1425	\N	\N
5908	\N	\N
1345	\N	\N
6334	\N	\N
6300	\N	\N
4704	\N	\N
9945	\N	\N
2675	\N	\N
1304	\N	\N
9891	\N	\N
5681	\N	\N
8187	\N	\N
2806	\N	\N
3537	\N	\N
1075	\N	\N
8877	\N	\N
5966	\N	\N
8853	\N	\N
4818	\N	\N
6056	\N	\N
6910	\N	\N
5560	\N	\N
1305	\N	\N
1071	\N	\N
8822	\N	\N
7977	\N	\N
5799	\N	\N
8997	\N	\N
3460	\N	\N
9838	\N	\N
9958	\N	\N
5114	\N	\N
6438	\N	\N
4167	\N	\N
5025	\N	\N
7477	\N	\N
8420	\N	\N
2614	\N	\N
9057	\N	\N
6354	\N	\N
7612	\N	\N
6233	\N	\N
4945	\N	\N
2737	\N	\N
3733	\N	\N
9396	\N	\N
2214	\N	\N
7573	\N	\N
1032	\N	\N
1843	\N	\N
9577	\N	\N
2600	\N	\N
8955	\N	\N
9026	\N	\N
2080	\N	\N
4329	\N	\N
1173	\N	\N
7550	\N	\N
4581	\N	\N
5252	\N	\N
2871	\N	\N
8965	\N	\N
1648	\N	\N
1787	\N	\N
8038	\N	\N
6225	\N	\N
5122	\N	\N
3919	\N	\N
4835	\N	\N
9407	\N	\N
5567	\N	\N
3750	\N	\N
5651	\N	\N
3783	\N	\N
1190	\N	\N
2329	\N	\N
6313	\N	\N
3459	\N	\N
8851	\N	\N
4411	\N	\N
5845	\N	\N
7521	\N	\N
8704	\N	\N
8082	\N	\N
4360	\N	\N
7917	\N	\N
5749	\N	\N
3844	\N	\N
3134	\N	\N
5832	\N	\N
9656	\N	\N
7436	\N	\N
3847	\N	\N
4398	\N	\N
4404	\N	\N
4458	\N	\N
2326	\N	\N
1976	\N	\N
9512	\N	\N
1830	\N	\N
1741	\N	\N
7077	\N	\N
6165	\N	\N
3712	\N	\N
4045	\N	\N
2472	\N	\N
3716	\N	\N
4976	\N	\N
7762	\N	\N
7232	\N	\N
1820	\N	\N
3807	\N	\N
4108	\N	\N
6493	\N	\N
6344	\N	\N
5473	\N	\N
2157	\N	\N
7847	\N	\N
2015	\N	\N
4296	\N	\N
1316	\N	\N
1901	\N	\N
7154	\N	\N
9922	\N	\N
8764	\N	\N
1626	\N	\N
3032	\N	\N
5702	\N	\N
8065	\N	\N
4854	\N	\N
8719	\N	\N
9148	\N	\N
6197	\N	\N
5199	\N	\N
5130	\N	\N
4508	\N	\N
4482	\N	\N
2218	\N	\N
1526	\N	\N
7932	\N	\N
8256	\N	\N
8646	\N	\N
3544	\N	\N
3869	\N	\N
5204	\N	\N
4982	\N	\N
8804	\N	\N
8680	\N	\N
6339	\N	\N
7434	\N	\N
9484	\N	\N
5496	\N	\N
1987	\N	\N
1569	\N	\N
6329	\N	\N
8561	\N	\N
5034	\N	\N
4474	\N	\N
5596	\N	\N
7302	\N	\N
7349	\N	\N
7343	\N	\N
1768	\N	\N
7668	\N	\N
5672	\N	\N
3129	\N	\N
1146	\N	\N
2650	\N	\N
4498	\N	\N
7954	\N	\N
7141	\N	\N
4729	\N	\N
5831	\N	\N
3480	\N	\N
7822	\N	\N
7660	\N	\N
3516	\N	\N
1397	\N	\N
6783	\N	\N
5462	\N	\N
7714	\N	\N
2771	\N	\N
9332	\N	\N
9546	\N	\N
7492	\N	\N
7340	\N	\N
4881	\N	\N
9737	\N	\N
8847	\N	\N
9118	\N	\N
5136	\N	\N
5747	\N	\N
7937	\N	\N
4441	\N	\N
6869	\N	\N
9535	\N	\N
8244	\N	\N
3737	\N	\N
2698	\N	\N
4230	\N	\N
7284	\N	\N
4559	\N	\N
5834	\N	\N
2576	\N	\N
4943	\N	\N
4007	\N	\N
3285	\N	\N
3363	\N	\N
1123	\N	\N
2820	\N	\N
5329	\N	\N
3170	\N	\N
4273	\N	\N
5529	\N	\N
8358	\N	\N
7960	\N	\N
9584	\N	\N
3986	\N	\N
5213	\N	\N
6605	\N	\N
3956	\N	\N
9361	\N	\N
2000	\N	\N
7562	\N	\N
8669	\N	\N
7161	\N	\N
2983	\N	\N
2097	\N	\N
4503	\N	\N
7663	\N	\N
6745	\N	\N
7121	\N	\N
7992	\N	\N
4917	\N	\N
9062	\N	\N
9811	\N	\N
3510	\N	\N
1806	\N	\N
2277	\N	\N
8233	\N	\N
8389	\N	\N
5364	\N	\N
7364	\N	\N
6311	\N	\N
2271	\N	\N
3742	\N	\N
6102	\N	\N
6673	\N	\N
7684	\N	\N
3039	\N	\N
1916	\N	\N
7225	\N	\N
5818	\N	\N
9613	\N	\N
4437	\N	\N
4276	\N	\N
6956	\N	\N
1769	\N	\N
6272	\N	\N
6365	\N	\N
8080	\N	\N
5882	\N	\N
7197	\N	\N
9732	\N	\N
9267	\N	\N
2405	\N	\N
2671	\N	\N
3882	\N	\N
1714	\N	\N
6049	\N	\N
7185	\N	\N
8397	\N	\N
9952	\N	\N
9987	\N	\N
6891	\N	\N
2944	\N	\N
1799	\N	\N
8499	\N	\N
6569	\N	\N
8417	\N	\N
4717	\N	\N
2152	\N	\N
2731	\N	\N
6488	\N	\N
8498	\N	\N
3790	\N	\N
4599	\N	\N
3472	\N	\N
2175	\N	\N
3128	\N	\N
6785	\N	\N
8155	\N	\N
3486	\N	\N
8242	\N	\N
1575	\N	\N
1414	\N	\N
9485	\N	\N
9494	\N	\N
1548	\N	\N
9398	\N	\N
4153	\N	\N
5509	\N	\N
5928	\N	\N
5082	\N	\N
8591	\N	\N
3151	\N	\N
7336	\N	\N
2072	\N	\N
3577	\N	\N
3992	\N	\N
2504	\N	\N
1519	\N	\N
1676	\N	\N
1424	\N	\N
4983	\N	\N
1842	\N	\N
4928	\N	\N
7170	\N	\N
6267	\N	\N
1775	\N	\N
3336	\N	\N
1078	\N	\N
8526	\N	\N
5347	\N	\N
4424	\N	\N
5469	\N	\N
7206	\N	\N
7739	\N	\N
2555	\N	\N
7453	\N	\N
8790	\N	\N
2172	\N	\N
7689	\N	\N
2148	\N	\N
6560	\N	\N
8014	\N	\N
2972	\N	\N
5139	\N	\N
2188	\N	\N
2942	\N	\N
5960	\N	\N
6769	\N	\N
4904	\N	\N
1997	\N	\N
4220	\N	\N
8363	\N	\N
5161	\N	\N
9839	\N	\N
8131	\N	\N
9607	\N	\N
8801	\N	\N
9426	\N	\N
8000	\N	\N
8225	\N	\N
6622	\N	\N
1609	\N	\N
7369	\N	\N
2117	\N	\N
4355	\N	\N
4689	\N	\N
3405	\N	\N
1585	\N	\N
3338	\N	\N
3345	\N	\N
9609	\N	\N
4560	\N	\N
8938	\N	\N
9640	\N	\N
3343	\N	\N
7094	\N	\N
5288	\N	\N
2776	\N	\N
2969	\N	\N
7709	\N	\N
7090	\N	\N
8286	\N	\N
4021	\N	\N
9600	\N	\N
6258	\N	\N
3497	\N	\N
3367	\N	\N
5422	\N	\N
9496	\N	\N
8649	\N	\N
3802	\N	\N
8973	\N	\N
6962	\N	\N
7427	\N	\N
7696	\N	\N
6193	\N	\N
4176	\N	\N
2026	\N	\N
3965	\N	\N
7721	\N	\N
6235	\N	\N
3304	\N	\N
9705	\N	\N
9547	\N	\N
8036	\N	\N
5504	\N	\N
6634	\N	\N
8612	\N	\N
2480	\N	\N
2644	\N	\N
7323	\N	\N
8370	\N	\N
7816	\N	\N
3447	\N	\N
1246	\N	\N
5224	\N	\N
5430	\N	\N
4624	\N	\N
2608	\N	\N
6268	\N	\N
6409	\N	\N
6065	\N	\N
4073	\N	\N
6376	\N	\N
9334	\N	\N
7643	\N	\N
8195	\N	\N
1407	\N	\N
6243	\N	\N
9524	\N	\N
8991	\N	\N
2567	\N	\N
2484	\N	\N
2750	\N	\N
7636	\N	\N
5325	\N	\N
1786	\N	\N
8500	\N	\N
3066	\N	\N
6234	\N	\N
8110	\N	\N
6583	\N	\N
2532	\N	\N
3576	\N	\N
4105	\N	\N
6286	\N	\N
8024	\N	\N
2461	\N	\N
1064	\N	\N
7127	\N	\N
3022	\N	\N
3085	\N	\N
4997	\N	\N
1035	\N	\N
7391	\N	\N
6981	\N	\N
7704	\N	\N
8373	\N	\N
8377	\N	\N
2542	\N	\N
3319	\N	\N
3614	\N	\N
3021	\N	\N
9645	\N	\N
6281	\N	\N
2708	\N	\N
9701	\N	\N
1457	\N	\N
9175	\N	\N
3154	\N	\N
3050	\N	\N
4519	\N	\N
4186	\N	\N
3080	\N	\N
4767	\N	\N
2687	\N	\N
2612	\N	\N
6767	\N	\N
8437	\N	\N
8060	\N	\N
1341	\N	\N
6032	\N	\N
6672	\N	\N
4447	\N	\N
2445	\N	\N
8890	\N	\N
5967	\N	\N
7515	\N	\N
2657	\N	\N
8086	\N	\N
2616	\N	\N
9442	\N	\N
1761	\N	\N
4911	\N	\N
2981	\N	\N
6204	\N	\N
4524	\N	\N
5714	\N	\N
8576	\N	\N
8540	\N	\N
4239	\N	\N
3547	\N	\N
2538	\N	\N
6721	\N	\N
3465	\N	\N
6945	\N	\N
5190	\N	\N
4238	\N	\N
5533	\N	\N
4711	\N	\N
8048	\N	\N
4328	\N	\N
3833	\N	\N
5461	\N	\N
4231	\N	\N
1201	\N	\N
6170	\N	\N
9380	\N	\N
2125	\N	\N
8778	\N	\N
4768	\N	\N
3720	\N	\N
8208	\N	\N
9104	\N	\N
8803	\N	\N
7280	\N	\N
1983	\N	\N
3776	\N	\N
9618	\N	\N
6356	\N	\N
8396	\N	\N
4778	\N	\N
5695	\N	\N
4601	\N	\N
2891	\N	\N
3556	\N	\N
7808	\N	\N
6186	\N	\N
5166	\N	\N
5885	\N	\N
3187	\N	\N
6822	\N	\N
4572	\N	\N
9423	\N	\N
5627	\N	\N
1813	\N	\N
5367	\N	\N
3671	\N	\N
7814	\N	\N
4802	\N	\N
8960	\N	\N
1655	\N	\N
5514	\N	\N
8442	\N	\N
9979	\N	\N
9025	\N	\N
6296	\N	\N
8652	\N	\N
4208	\N	\N
7675	\N	\N
3971	\N	\N
1222	\N	\N
3904	\N	\N
7548	\N	\N
7238	\N	\N
2053	\N	\N
5586	\N	\N
7861	\N	\N
1353	\N	\N
6061	\N	\N
6086	\N	\N
5078	\N	\N
3163	\N	\N
3862	\N	\N
2679	\N	\N
9797	\N	\N
4318	\N	\N
6127	\N	\N
3389	\N	\N
5771	\N	\N
6017	\N	\N
2753	\N	\N
5031	\N	\N
4104	\N	\N
2041	\N	\N
5827	\N	\N
7890	\N	\N
6873	\N	\N
8556	\N	\N
5796	\N	\N
1373	\N	\N
4933	\N	\N
7494	\N	\N
8820	\N	\N
5393	\N	\N
5906	\N	\N
1894	\N	\N
8514	\N	\N
4564	\N	\N
7961	\N	\N
7611	\N	\N
1237	\N	\N
2859	\N	\N
7966	\N	\N
4815	\N	\N
2067	\N	\N
1712	\N	\N
3411	\N	\N
2714	\N	\N
6260	\N	\N
2852	\N	\N
6293	\N	\N
1598	\N	\N
2047	\N	\N
8741	\N	\N
7102	\N	\N
1018	\N	\N
9615	\N	\N
4158	\N	\N
2118	\N	\N
7304	\N	\N
4527	\N	\N
9500	\N	\N
6123	\N	\N
2933	\N	\N
6107	\N	\N
7776	\N	\N
4292	\N	\N
8371	\N	\N
3048	\N	\N
4246	\N	\N
1764	\N	\N
9831	\N	\N
6401	\N	\N
9055	\N	\N
6143	\N	\N
7513	\N	\N
3681	\N	\N
5871	\N	\N
4654	\N	\N
6121	\N	\N
3562	\N	\N
2497	\N	\N
3229	\N	\N
5943	\N	\N
1033	\N	\N
7486	\N	\N
6081	\N	\N
7100	\N	\N
5188	\N	\N
2068	\N	\N
6624	\N	\N
8509	\N	\N
1500	\N	\N
7916	\N	\N
4147	\N	\N
9286	\N	\N
6651	\N	\N
2926	\N	\N
3334	\N	\N
1723	\N	\N
6008	\N	\N
2258	\N	\N
2138	\N	\N
4834	\N	\N
6572	\N	\N
9759	\N	\N
9153	\N	\N
7865	\N	\N
9950	\N	\N
7946	\N	\N
4478	\N	\N
8251	\N	\N
3981	\N	\N
8078	\N	\N
8866	\N	\N
1560	\N	\N
6727	\N	\N
4809	\N	\N
7029	\N	\N
3346	\N	\N
6906	\N	\N
3622	\N	\N
1356	\N	\N
6580	\N	\N
8388	\N	\N
2531	\N	\N
8799	\N	\N
1238	\N	\N
1566	\N	\N
6310	\N	\N
7860	\N	\N
4026	\N	\N
1858	\N	\N
3100	\N	\N
7174	\N	\N
3362	\N	\N
8229	\N	\N
3744	\N	\N
6283	\N	\N
9937	\N	\N
4965	\N	\N
7501	\N	\N
9016	\N	\N
8832	\N	\N
6410	\N	\N
9967	\N	\N
1654	\N	\N
8190	\N	\N
1390	\N	\N
1524	\N	\N
3613	\N	\N
1170	\N	\N
6598	\N	\N
4435	\N	\N
4889	\N	\N
6411	\N	\N
2221	\N	\N
3979	\N	\N
7723	\N	\N
6023	\N	\N
4356	\N	\N
1941	\N	\N
5179	\N	\N
9194	\N	\N
9306	\N	\N
6466	\N	\N
9570	\N	\N
3431	\N	\N
3454	\N	\N
5098	\N	\N
9255	\N	\N
9047	\N	\N
6641	\N	\N
8470	\N	\N
4490	\N	\N
8584	\N	\N
6454	\N	\N
7951	\N	\N
2778	\N	\N
7489	\N	\N
9314	\N	\N
2463	\N	\N
6881	\N	\N
4085	\N	\N
7098	\N	\N
9746	\N	\N
8169	\N	\N
9144	\N	\N
6237	\N	\N
4736	\N	\N
8846	\N	\N
4188	\N	\N
9092	\N	\N
9400	\N	\N
6489	\N	\N
6371	\N	\N
8753	\N	\N
5585	\N	\N
1220	\N	\N
8493	\N	\N
8462	\N	\N
3152	\N	\N
5344	\N	\N
1408	\N	\N
2822	\N	\N
3648	\N	\N
5293	\N	\N
4865	\N	\N
7862	\N	\N
3296	\N	\N
8385	\N	\N
2227	\N	\N
9359	\N	\N
1909	\N	\N
9250	\N	\N
2054	\N	\N
2605	\N	\N
8503	\N	\N
3943	\N	\N
6595	\N	\N
2201	\N	\N
6501	\N	\N
9336	\N	\N
1149	\N	\N
2255	\N	\N
1215	\N	\N
7909	\N	\N
9934	\N	\N
4880	\N	\N
5457	\N	\N
8579	\N	\N
7943	\N	\N
3144	\N	\N
3104	\N	\N
5937	\N	\N
2466	\N	\N
4405	\N	\N
4740	\N	\N
1420	\N	\N
7014	\N	\N
7130	\N	\N
6902	\N	\N
3748	\N	\N
4154	\N	\N
4951	\N	\N
5492	\N	\N
6880	\N	\N
5164	\N	\N
4761	\N	\N
1852	\N	\N
2465	\N	\N
2816	\N	\N
3601	\N	\N
2793	\N	\N
1150	\N	\N
7732	\N	\N
7686	\N	\N
8133	\N	\N
6719	\N	\N
8857	\N	\N
3854	\N	\N
9356	\N	\N
6739	\N	\N
4345	\N	\N
8613	\N	\N
5291	\N	\N
5597	\N	\N
9919	\N	\N
6483	\N	\N
9675	\N	\N
1025	\N	\N
9208	\N	\N
2266	\N	\N
5621	\N	\N
2422	\N	\N
4381	\N	\N
8642	\N	\N
7970	\N	\N
2855	\N	\N
6138	\N	\N
1705	\N	\N
3073	\N	\N
5697	\N	\N
1332	\N	\N
8693	\N	\N
8461	\N	\N
8845	\N	\N
5135	\N	\N
4539	\N	\N
3782	\N	\N
9353	\N	\N
8696	\N	\N
3147	\N	\N
9404	\N	\N
6736	\N	\N
1465	\N	\N
9504	\N	\N
2964	\N	\N
3466	\N	\N
5000	\N	\N
8793	\N	\N
4726	\N	\N
1241	\N	\N
2625	\N	\N
6190	\N	\N
6209	\N	\N
5692	\N	\N
7257	\N	\N
3770	\N	\N
8467	\N	\N
8016	\N	\N
6599	\N	\N
6752	\N	\N
4789	\N	\N
9927	\N	\N
5358	\N	\N
9680	\N	\N
6680	\N	\N
9554	\N	\N
3016	\N	\N
7285	\N	\N
9548	\N	\N
4139	\N	\N
3617	\N	\N
2554	\N	\N
8252	\N	\N
3026	\N	\N
3587	\N	\N
1254	\N	\N
6227	\N	\N
6367	\N	\N
6214	\N	\N
9633	\N	\N
8759	\N	\N
2883	\N	\N
1877	\N	\N
6070	\N	\N
3743	\N	\N
3419	\N	\N
3298	\N	\N
9114	\N	\N
7635	\N	\N
1183	\N	\N
5635	\N	\N
3421	\N	\N
3842	\N	\N
4250	\N	\N
5810	\N	\N
8176	\N	\N
1690	\N	\N
8523	\N	\N
9390	\N	\N
5797	\N	\N
8173	\N	\N
9978	\N	\N
4476	\N	\N
3017	\N	\N
2917	\N	\N
3241	\N	\N
8979	\N	\N
1827	\N	\N
7445	\N	\N
3645	\N	\N
4574	\N	\N
7019	\N	\N
1021	\N	\N
4575	\N	\N
4968	\N	\N
7707	\N	\N
5075	\N	\N
7766	\N	\N
4303	\N	\N
7066	\N	\N
8943	\N	\N
4517	\N	\N
2285	\N	\N
5138	\N	\N
7736	\N	\N
4635	\N	\N
5319	\N	\N
3461	\N	\N
6337	\N	\N
1082	\N	\N
6626	\N	\N
3135	\N	\N
7050	\N	\N
2955	\N	\N
3528	\N	\N
8382	\N	\N
6920	\N	\N
2335	\N	\N
5540	\N	\N
4333	\N	\N
4964	\N	\N
6749	\N	\N
9832	\N	\N
3130	\N	\N
7850	\N	\N
7297	\N	\N
7187	\N	\N
1835	\N	\N
3845	\N	\N
3630	\N	\N
7140	\N	\N
6251	\N	\N
3068	\N	\N
1908	\N	\N
4102	\N	\N
7173	\N	\N
1702	\N	\N
7665	\N	\N
7166	\N	\N
2082	\N	\N
7531	\N	\N
6058	\N	\N
5352	\N	\N
7254	\N	\N
4991	\N	\N
7266	\N	\N
2770	\N	\N
3109	\N	\N
4699	\N	\N
2516	\N	\N
3508	\N	\N
8925	\N	\N
1200	\N	\N
1497	\N	\N
3685	\N	\N
4506	\N	\N
6177	\N	\N
9506	\N	\N
7927	\N	\N
4443	\N	\N
8554	\N	\N
9051	\N	\N
3293	\N	\N
3724	\N	\N
4921	\N	\N
2382	\N	\N
6366	\N	\N
1536	\N	\N
1214	\N	\N
5878	\N	\N
7503	\N	\N
8476	\N	\N
6351	\N	\N
1206	\N	\N
5108	\N	\N
3868	\N	\N
8852	\N	\N
3266	\N	\N
3318	\N	\N
1294	\N	\N
8339	\N	\N
9212	\N	\N
5227	\N	\N
8659	\N	\N
2200	\N	\N
2385	\N	\N
5847	\N	\N
1505	\N	\N
7639	\N	\N
8059	\N	\N
2846	\N	\N
2965	\N	\N
2460	\N	\N
7699	\N	\N
5265	\N	\N
4686	\N	\N
6614	\N	\N
9327	\N	\N
2813	\N	\N
4168	\N	\N
9713	\N	\N
9198	\N	\N
4359	\N	\N
6883	\N	\N
8362	\N	\N
1134	\N	\N
2888	\N	\N
6811	\N	\N
7023	\N	\N
1962	\N	\N
8352	\N	\N
8359	\N	\N
5547	\N	\N
6229	\N	\N
3077	\N	\N
2535	\N	\N
4827	\N	\N
8833	\N	\N
2099	\N	\N
6384	\N	\N
9733	\N	\N
2004	\N	\N
1694	\N	\N
7401	\N	\N
8895	\N	\N
7957	\N	\N
5208	\N	\N
1885	\N	\N
2267	\N	\N
6800	\N	\N
9885	\N	\N
1130	\N	\N
8641	\N	\N
5297	\N	\N
7437	\N	\N
8917	\N	\N
7282	\N	\N
4648	\N	\N
2458	\N	\N
6368	\N	\N
7306	\N	\N
6577	\N	\N
6369	\N	\N
9146	\N	\N
5725	\N	\N
8144	\N	\N
7160	\N	\N
1387	\N	\N
2597	\N	\N
8598	\N	\N
4845	\N	\N
1529	\N	\N
1805	\N	\N
5402	\N	\N
3552	\N	\N
6447	\N	\N
6278	\N	\N
5332	\N	\N
5911	\N	\N
1621	\N	\N
6151	\N	\N
2523	\N	\N
9338	\N	\N
1292	\N	\N
7169	\N	\N
1773	\N	\N
6640	\N	\N
4093	\N	\N
3924	\N	\N
8735	\N	\N
9186	\N	\N
6415	\N	\N
8717	\N	\N
5143	\N	\N
6152	\N	\N
6591	\N	\N
2264	\N	\N
4614	\N	\N
5365	\N	\N
4484	\N	\N
1881	\N	\N
6666	\N	\N
3329	\N	\N
4646	\N	\N
2128	\N	\N
2511	\N	\N
5202	\N	\N
3595	\N	\N
5976	\N	\N
1296	\N	\N
7788	\N	\N
9777	\N	\N
7005	\N	\N
1180	\N	\N
4919	\N	\N
9206	\N	\N
4856	\N	\N
3222	\N	\N
9627	\N	\N
6469	\N	\N
7194	\N	\N
2702	\N	\N
1603	\N	\N
6031	\N	\N
5118	\N	\N
1210	\N	\N
4548	\N	\N
3830	\N	\N
8058	\N	\N
7071	\N	\N
9266	\N	\N
3713	\N	\N
9739	\N	\N
4135	\N	\N
4737	\N	\N
5732	\N	\N
3551	\N	\N
1867	\N	\N
2821	\N	\N
8673	\N	\N
8698	\N	\N
6864	\N	\N
5694	\N	\N
8566	\N	\N
4364	\N	\N
5076	\N	\N
7153	\N	\N
8957	\N	\N
1461	\N	\N
2213	\N	\N
4822	\N	\N
8875	\N	\N
1306	\N	\N
5494	\N	\N
6533	\N	\N
7198	\N	\N
1471	\N	\N
5766	\N	\N
6441	\N	\N
8712	\N	\N
9906	\N	\N
6262	\N	\N
3673	\N	\N
9580	\N	\N
8042	\N	\N
3316	\N	\N
5399	\N	\N
3715	\N	\N
3585	\N	\N
9017	\N	\N
5035	\N	\N
8216	\N	\N
3610	\N	\N
1677	\N	\N
8867	\N	\N
1507	\N	\N
1330	\N	\N
8010	\N	\N
5296	\N	\N
8335	\N	\N
5298	\N	\N
7536	\N	\N
5765	\N	\N
5718	\N	\N
2079	\N	\N
8876	\N	\N
6021	\N	\N
3287	\N	\N
8942	\N	\N
4998	\N	\N
5684	\N	\N
1339	\N	\N
7900	\N	\N
5658	\N	\N
5128	\N	\N
6129	\N	\N
9775	\N	\N
4445	\N	\N
2272	\N	\N
7463	\N	\N
8093	\N	\N
9902	\N	\N
1777	\N	\N
7047	\N	\N
8732	\N	\N
5889	\N	\N
4586	\N	\N
9369	\N	\N
3302	\N	\N
3276	\N	\N
5820	\N	\N
4725	\N	\N
6969	\N	\N
4613	\N	\N
5919	\N	\N
3987	\N	\N
6522	\N	\N
5554	\N	\N
3545	\N	\N
8755	\N	\N
5476	\N	\N
9516	\N	\N
7798	\N	\N
8608	\N	\N
7368	\N	\N
8589	\N	\N
7186	\N	\N
8604	\N	\N
8904	\N	\N
6798	\N	\N
8006	\N	\N
7561	\N	\N
8635	\N	\N
2962	\N	\N
5699	\N	\N
9042	\N	\N
4674	\N	\N
3633	\N	\N
5602	\N	\N
9070	\N	\N
2381	\N	\N
5512	\N	\N
9048	\N	\N
9766	\N	\N
7041	\N	\N
4274	\N	\N
7176	\N	\N
7528	\N	\N
1368	\N	\N
8849	\N	\N
5470	\N	\N
3911	\N	\N
9138	\N	\N
2424	\N	\N
9761	\N	\N
2070	\N	\N
3369	\N	\N
2108	\N	\N
3240	\N	\N
5829	\N	\N
1174	\N	\N
2451	\N	\N
2345	\N	\N
6055	\N	\N
3765	\N	\N
8859	\N	\N
1351	\N	\N
2113	\N	\N
6422	\N	\N
5851	\N	\N
9437	\N	\N
5060	\N	\N
7869	\N	\N
1303	\N	\N
1589	\N	\N
6306	\N	\N
5088	\N	\N
6404	\N	\N
3425	\N	\N
8881	\N	\N
9869	\N	\N
6481	\N	\N
3396	\N	\N
9466	\N	\N
2402	\N	\N
7211	\N	\N
5418	\N	\N
6442	\N	\N
6675	\N	\N
7649	\N	\N
8516	\N	\N
2668	\N	\N
6619	\N	\N
3383	\N	\N
2636	\N	\N
5028	\N	\N
2184	\N	\N
8736	\N	\N
9204	\N	\N
8383	\N	\N
4454	\N	\N
7529	\N	\N
7560	\N	\N
3208	\N	\N
2196	\N	\N
9853	\N	\N
9278	\N	\N
4112	\N	\N
8616	\N	\N
6872	\N	\N
1988	\N	\N
7320	\N	\N
5700	\N	\N
4956	\N	\N
3173	\N	\N
2837	\N	\N
5187	\N	\N
7308	\N	\N
8501	\N	\N
4349	\N	\N
4831	\N	\N
4583	\N	\N
3626	\N	\N
1763	\N	\N
8878	\N	\N
6104	\N	\N
1718	\N	\N
2844	\N	\N
4365	\N	\N
4824	\N	\N
8235	\N	\N
9438	\N	\N
3881	\N	\N
8880	\N	\N
4554	\N	\N
2207	\N	\N
2802	\N	\N
8137	\N	\N
7819	\N	\N
4103	\N	\N
9772	\N	\N
5285	\N	\N
9376	\N	\N
2403	\N	\N
5050	\N	\N
5887	\N	\N
4171	\N	\N
5850	\N	\N
4691	\N	\N
1454	\N	\N
3741	\N	\N
7246	\N	\N
7854	\N	\N
5729	\N	\N
6629	\N	\N
2628	\N	\N
7549	\N	\N
6406	\N	\N
2475	\N	\N
8105	\N	\N
2936	\N	\N
5898	\N	\N
5800	\N	\N
2414	\N	\N
9586	\N	\N
1439	\N	\N
1399	\N	\N
5182	\N	\N
5995	\N	\N
7178	\N	\N
2038	\N	\N
3457	\N	\N
2632	\N	\N
5663	\N	\N
7614	\N	\N
9377	\N	\N
3890	\N	\N
4616	\N	\N
8586	\N	\N
9477	\N	\N
2442	\N	\N
3376	\N	\N
7383	\N	\N
4169	\N	\N
4779	\N	\N
3536	\N	\N
7627	\N	\N
9279	\N	\N
7447	\N	\N
6737	\N	\N
3002	\N	\N
2670	\N	\N
4750	\N	\N
4637	\N	\N
1377	\N	\N
8458	\N	\N
1960	\N	\N
1924	\N	\N
7605	\N	\N
6664	\N	\N
1736	\N	\N
9817	\N	\N
2091	\N	\N
9189	\N	\N
3766	\N	\N
6282	\N	\N
8161	\N	\N
6317	\N	\N
7824	\N	\N
5068	\N	\N
5754	\N	\N
9874	\N	\N
4138	\N	\N
7462	\N	\N
4596	\N	\N
7374	\N	\N
5067	\N	\N
5993	\N	\N
3674	\N	\N
2074	\N	\N
6246	\N	\N
2552	\N	\N
1145	\N	\N
1286	\N	\N
1921	\N	\N
2624	\N	\N
8654	\N	\N
6989	\N	\N
1657	\N	\N
7248	\N	\N
1831	\N	\N
8706	\N	\N
4684	\N	\N
8553	\N	\N
7947	\N	\N
6966	\N	\N
7423	\N	\N
5394	\N	\N
7271	\N	\N
7895	\N	\N
1979	\N	\N
7233	\N	\N
6695	\N	\N
5659	\N	\N
2893	\N	\N
1879	\N	\N
6467	\N	\N
2810	\N	\N
3198	\N	\N
8166	\N	\N
1169	\N	\N
3843	\N	\N
2469	\N	\N
5588	\N	\N
7793	\N	\N
4600	\N	\N
3755	\N	\N
3355	\N	\N
2412	\N	\N
8390	\N	\N
4992	\N	\N
7272	\N	\N
9957	\N	\N
9244	\N	\N
1067	\N	\N
5994	\N	\N
3936	\N	\N
4653	\N	\N
7774	\N	\N
8666	\N	\N
5385	\N	\N
8025	\N	\N
8757	\N	\N
9690	\N	\N
4848	\N	\N
6980	\N	\N
3007	\N	\N
4439	\N	\N
2724	\N	\N
7742	\N	\N
9122	\N	\N
1859	\N	\N
8529	\N	\N
5645	\N	\N
9467	\N	\N
5150	\N	\N
2223	\N	\N
9230	\N	\N
2627	\N	\N
5903	\N	\N
7552	\N	\N
5843	\N	\N
4097	\N	\N
2456	\N	\N
9843	\N	\N
2872	\N	\N
5858	\N	\N
2922	\N	\N
1990	\N	\N
8329	\N	\N
3413	\N	\N
9712	\N	\N
3749	\N	\N
4833	\N	\N
4500	\N	\N
8119	\N	\N
8962	\N	\N
7322	\N	\N
7081	\N	\N
2085	\N	\N
4350	\N	\N
9988	\N	\N
7777	\N	\N
4040	\N	\N
9022	\N	\N
4732	\N	\N
3494	\N	\N
2825	\N	\N
3220	\N	\N
3464	\N	\N
3192	\N	\N
3040	\N	\N
9894	\N	\N
6931	\N	\N
5286	\N	\N
5229	\N	\N
9319	\N	\N
8990	\N	\N
9526	\N	\N
5386	\N	\N
1161	\N	\N
9489	\N	\N
4113	\N	\N
5425	\N	\N
5947	\N	\N
1890	\N	\N
5083	\N	\N
2741	\N	\N
8650	\N	\N
1716	\N	\N
1153	\N	\N
6725	\N	\N
8283	\N	\N
4877	\N	\N
7258	\N	\N
1164	\N	\N
3657	\N	\N
9113	\N	\N
2697	\N	\N
7935	\N	\N
8630	\N	\N
8530	\N	\N
9021	\N	\N
1774	\N	\N
1204	\N	\N
6955	\N	\N
1861	\N	\N
9284	\N	\N
1945	\N	\N
8266	\N	\N
3583	\N	\N
2663	\N	\N
6383	\N	\N
9273	\N	\N
5350	\N	\N
4166	\N	\N
5089	\N	\N
7475	\N	\N
4262	\N	\N
2044	\N	\N
3774	\N	\N
6556	\N	\N
4980	\N	\N
1019	\N	\N
8623	\N	\N
3884	\N	\N
5961	\N	\N
2359	\N	\N
7651	\N	\N
1635	\N	\N
2573	\N	\N
6961	\N	\N
4987	\N	\N
8090	\N	\N
6484	\N	\N
1404	\N	\N
5582	\N	\N
8956	\N	\N
4544	\N	\N
4096	\N	\N
2878	\N	\N
8406	\N	\N
3065	\N	\N
6612	\N	\N
6517	\N	\N
4125	\N	\N
3780	\N	\N
1012	\N	\N
6395	\N	\N
4670	\N	\N
9479	\N	\N
5271	\N	\N
8734	\N	\N
9350	\N	\N
3703	\N	\N
4632	\N	\N
1059	\N	\N
5021	\N	\N
6958	\N	\N
3941	\N	\N
2583	\N	\N
9241	\N	\N
3470	\N	\N
6531	\N	\N
2236	\N	\N
9998	\N	\N
7812	\N	\N
9744	\N	\N
5667	\N	\N
2331	\N	\N
9247	\N	\N
1267	\N	\N
2692	\N	\N
2352	\N	\N
7761	\N	\N
9936	\N	\N
4611	\N	\N
3995	\N	\N
9038	\N	\N
2681	\N	\N
1574	\N	\N
4386	\N	\N
7370	\N	\N
5868	\N	\N
4204	\N	\N
1219	\N	\N
4091	\N	\N
5411	\N	\N
1088	\N	\N
3665	\N	\N
9538	\N	\N
6908	\N	\N
4790	\N	\N
4114	\N	\N
7337	\N	\N
2282	\N	\N
5120	\N	\N
3906	\N	\N
9439	\N	\N
4974	\N	\N
9604	\N	\N
9710	\N	\N
1487	\N	\N
1704	\N	\N
9540	\N	\N
7913	\N	\N
1892	\N	\N
3722	\N	\N
6812	\N	\N
6868	\N	\N
1817	\N	\N
9961	\N	\N
7125	\N	\N
9425	\N	\N
3754	\N	\N
1040	\N	\N
2324	\N	\N
5406	\N	\N
5774	\N	\N
8012	\N	\N
9565	\N	\N
6885	\N	\N
6670	\N	\N
4039	\N	\N
1798	\N	\N
6308	\N	\N
8701	\N	\N
9909	\N	\N
4979	\N	\N
7685	\N	\N
6425	\N	\N
1633	\N	\N
6600	\N	\N
1384	\N	\N
8773	\N	\N
2544	\N	\N
7179	\N	\N
4585	\N	\N
9752	\N	\N
2333	\N	\N
4160	\N	\N
8376	\N	\N
9666	\N	\N
8617	\N	\N
6682	\N	\N
3914	\N	\N
5985	\N	\N
6494	\N	\N
6878	\N	\N
1811	\N	\N
3501	\N	\N
9915	\N	\N
2133	\N	\N
5939	\N	\N
7778	\N	\N
2976	\N	\N
4275	\N	\N
8811	\N	\N
5991	\N	\N
1708	\N	\N
6846	\N	\N
2373	\N	\N
6728	\N	\N
4306	\N	\N
4677	\N	\N
5407	\N	\N
2390	\N	\N
3793	\N	\N
9804	\N	\N
9916	\N	\N
5157	\N	\N
3711	\N	\N
1243	\N	\N
6858	\N	\N
7429	\N	\N
6773	\N	\N
8117	\N	\N
1547	\N	\N
7679	\N	\N
2360	\N	\N
2317	\N	\N
7048	\N	\N
8733	\N	\N
9411	\N	\N
7553	\N	\N
9592	\N	\N
9468	\N	\N
1314	\N	\N
2473	\N	\N
9039	\N	\N
9354	\N	\N
6324	\N	\N
9918	\N	\N
9323	\N	\N
1993	\N	\N
2611	\N	\N
5397	\N	\N
9063	\N	\N
7899	\N	\N
3043	\N	\N
6848	\N	\N
2212	\N	\N
3824	\N	\N
5381	\N	\N
1701	\N	\N
7184	\N	\N
8976	\N	\N
2561	\N	\N
5769	\N	\N
7834	\N	\N
3249	\N	\N
6244	\N	\N
7938	\N	\N
4477	\N	\N
3560	\N	\N
1929	\N	\N
6512	\N	\N
4149	\N	\N
9451	\N	\N
9724	\N	\N
3540	\N	\N
7417	\N	\N
9311	\N	\N
2660	\N	\N
9908	\N	\N
7944	\N	\N
5616	\N	\N
9559	\N	\N
7881	\N	\N
5823	\N	\N
4584	\N	\N
5117	\N	\N
3139	\N	\N
6353	\N	\N
3280	\N	\N
8003	\N	\N
4534	\N	\N
2399	\N	\N
2307	\N	\N
5629	\N	\N
6954	\N	\N
4384	\N	\N
3827	\N	\N
9953	\N	\N
4185	\N	\N
9328	\N	\N
5630	\N	\N
6978	\N	\N
3953	\N	\N
5280	\N	\N
3500	\N	\N
4346	\N	\N
7316	\N	\N
3542	\N	\N
1137	\N	\N
9182	\N	\N
8249	\N	\N
5872	\N	\N
2954	\N	\N
9942	\N	\N
6277	\N	\N
6585	\N	\N
8982	\N	\N
8615	\N	\N
9972	\N	\N
4380	\N	\N
2665	\N	\N
8492	\N	\N
2312	\N	\N
7394	\N	\N
6699	\N	\N
6740	\N	\N
9388	\N	\N
6397	\N	\N
5793	\N	\N
6882	\N	\N
6660	\N	\N
6914	\N	\N
1685	\N	\N
7191	\N	\N
8784	\N	\N
4352	\N	\N
7583	\N	\N
9841	\N	\N
4701	\N	\N
9497	\N	\N
5310	\N	\N
2601	\N	\N
6000	\N	\N
6113	\N	\N
5434	\N	\N
6312	\N	\N
1065	\N	\N
8248	\N	\N
3271	\N	\N
4287	\N	\N
5380	\N	\N
9035	\N	\N
4198	\N	\N
6088	\N	\N
2417	\N	\N
3729	\N	\N
2686	\N	\N
3320	\N	\N
9566	\N	\N
3268	\N	\N
3452	\N	\N
8743	\N	\N
9750	\N	\N
1968	\N	\N
7222	\N	\N
2835	\N	\N
5854	\N	\N
8834	\N	\N
2162	\N	\N
5362	\N	\N
9884	\N	\N
5789	\N	\N
8238	\N	\N
1612	\N	\N
1375	\N	\N
1899	\N	\N
2204	\N	\N
3575	\N	\N
9291	\N	\N
9276	\N	\N
1355	\N	\N
9541	\N	\N
5899	\N	\N
5957	\N	\N
6554	\N	\N
1819	\N	\N
8039	\N	\N
7150	\N	\N
3655	\N	\N
2700	\N	\N
9892	\N	\N
4015	\N	\N
3390	\N	\N
4775	\N	\N
2951	\N	\N
9379	\N	\N
2961	\N	\N
4302	\N	\N
5100	\N	\N
8814	\N	\N
4375	\N	\N
1295	\N	\N
6802	\N	\N
2106	\N	\N
6290	\N	\N
2718	\N	\N
5750	\N	\N
2630	\N	\N
4547	\N	\N
6245	\N	\N
3809	\N	\N
5753	\N	\N
5566	\N	\N
7404	\N	\N
5018	\N	\N
6967	\N	\N
3668	\N	\N
9847	\N	\N
2478	\N	\N
4311	\N	\N
8975	\N	\N
6592	\N	\N
2851	\N	\N
6402	\N	\N
1409	\N	\N
2229	\N	\N
3967	\N	\N
1299	\N	\N
6817	\N	\N
6563	\N	\N
7025	\N	\N
4563	\N	\N
3242	\N	\N
4721	\N	\N
5634	\N	\N
8116	\N	\N
3695	\N	\N
9421	\N	\N
8063	\N	\N
3360	\N	\N
2508	\N	\N
7615	\N	\N
9751	\N	\N
5493	\N	\N
9317	\N	\N
5209	\N	\N
9079	\N	\N
7958	\N	\N
4403	\N	\N
5251	\N	\N
5254	\N	\N
1634	\N	\N
4218	\N	\N
1083	\N	\N
4784	\N	\N
6683	\N	\N
8674	\N	\N
9579	\N	\N
6768	\N	\N
7567	\N	\N
9941	\N	\N
1836	\N	\N
5936	\N	\N
5295	\N	\N
4190	\N	\N
4419	\N	\N
8766	\N	\N
3624	\N	\N
5783	\N	\N
2856	\N	\N
1814	\N	\N
8570	\N	\N
3428	\N	\N
3078	\N	\N
4520	\N	\N
1271	\N	\N
1016	\N	\N
5679	\N	\N
1462	\N	\N
2633	\N	\N
9511	\N	\N
9030	\N	\N
9085	\N	\N
2034	\N	\N
7510	\N	\N
8379	\N	\N
9304	\N	\N
3683	\N	\N
8435	\N	\N
1015	\N	\N
1030	\N	\N
6230	\N	\N
8777	\N	\N
2539	\N	\N
7470	\N	\N
3366	\N	\N
7313	\N	\N
2431	\N	\N
9420	\N	\N
9668	\N	\N
5784	\N	\N
1689	\N	\N
1453	\N	\N
9893	\N	\N
4165	\N	\N
1520	\N	\N
8663	\N	\N
7162	\N	\N
7011	\N	\N
7107	\N	\N
6302	\N	\N
1880	\N	\N
5125	\N	\N
2548	\N	\N
4595	\N	\N
5782	\N	\N
2216	\N	\N
7908	\N	\N
2683	\N	\N
8142	\N	\N
8212	\N	\N
4260	\N	\N
3019	\N	\N
3069	\N	\N
1218	\N	\N
8661	\N	\N
9642	\N	\N
5112	\N	\N
4620	\N	\N
7697	\N	\N
3167	\N	\N
9366	\N	\N
2598	\N	\N
7608	\N	\N
9594	\N	\N
9265	\N	\N
6795	\N	\N
2492	\N	\N
7941	\N	\N
5603	\N	\N
3102	\N	\N
5655	\N	\N
4758	\N	\N
1816	\N	\N
8910	\N	\N
3358	\N	\N
4234	\N	\N
1062	\N	\N
9828	\N	\N
4569	\N	\N
9872	\N	\N
6331	\N	\N
5626	\N	\N
6051	\N	\N
4336	\N	\N
9082	\N	\N
9154	\N	\N
3961	\N	\N
1099	\N	\N
4786	\N	\N
9081	\N	\N
2061	\N	\N
9620	\N	\N
8638	\N	\N
5429	\N	\N
6653	\N	\N
8293	\N	\N
7001	\N	\N
3394	\N	\N
1378	\N	\N
3918	\N	\N
7410	\N	\N
6124	\N	\N
4990	\N	\N
6133	\N	\N
6538	\N	\N
7420	\N	\N
1423	\N	\N
9019	\N	\N
2568	\N	\N
8414	\N	\N
7989	\N	\N
2380	\N	\N
4144	\N	\N
9243	\N	\N
4903	\N	\N
9006	\N	\N
9147	\N	\N
9167	\N	\N
3966	\N	\N
4561	\N	\N
5442	\N	\N
5643	\N	\N
7165	\N	\N
2181	\N	\N
8483	\N	\N
5822	\N	\N
6502	\N	\N
6492	\N	\N
6929	\N	\N
9403	\N	\N
4323	\N	\N
2654	\N	\N
3877	\N	\N
9108	\N	\N
8633	\N	\N
6527	\N	\N
4223	\N	\N
7430	\N	\N
1003	\N	\N
2828	\N	\N
7669	\N	\N
3557	\N	\N
4012	\N	\N
5574	\N	\N
1964	\N	\N
8977	\N	\N
2772	\N	\N
4059	\N	\N
1897	\N	\N
8823	\N	\N
7914	\N	\N
9925	\N	\N
8049	\N	\N
5665	\N	\N
1944	\N	\N
1193	\N	\N
8835	\N	\N
1544	\N	\N
8122	\N	\N
6631	\N	\N
3239	\N	\N
9023	\N	\N
7506	\N	\N
5757	\N	\N
8472	\N	\N
3990	\N	\N
7157	\N	\N
2005	\N	\N
5999	\N	\N
9322	\N	\N
8487	\N	\N
8939	\N	\N
5012	\N	\N
6421	\N	\N
4217	\N	\N
9876	\N	\N
4806	\N	\N
6632	\N	\N
8629	\N	\N
7765	\N	\N
8228	\N	\N
6510	\N	\N
9367	\N	\N
2789	\N	\N
6316	\N	\N
5920	\N	\N
9634	\N	\N
5237	\N	\N
7205	\N	\N
4550	\N	\N
7490	\N	\N
4567	\N	\N
3859	\N	\N
4839	\N	\N
1208	\N	\N
1674	\N	\N
1523	\N	\N
7884	\N	\N
3000	\N	\N
9943	\N	\N
6537	\N	\N
3451	\N	\N
4538	\N	\N
1627	\N	\N
2174	\N	\N
4248	\N	\N
2084	\N	\N
4576	\N	\N
2243	\N	\N
3503	\N	\N
6304	\N	\N
7730	\N	\N
9696	\N	\N
2701	\N	\N
2672	\N	\N
7016	\N	\N
4254	\N	\N
6053	\N	\N
6002	\N	\N
4698	\N	\N
4629	\N	\N
7811	\N	\N
2791	\N	\N
8354	\N	\N
6456	\N	\N
6490	\N	\N
7207	\N	\N
5277	\N	\N
7034	\N	\N
8763	\N	\N
1225	\N	\N
2198	\N	\N
9567	\N	\N
8496	\N	\N
2992	\N	\N
4084	\N	\N
7888	\N	\N
1301	\N	\N
6042	\N	\N
8619	\N	\N
2322	\N	\N
9233	\N	\N
3337	\N	\N
7690	\N	\N
8465	\N	\N
6303	\N	\N
6171	\N	\N
4031	\N	\N
5431	\N	\N
7634	\N	\N
6949	\N	\N
7575	\N	\N
1703	\N	\N
2775	\N	\N
9581	\N	\N
1441	\N	\N
6206	\N	\N
1438	\N	\N
6221	\N	\N
7353	\N	\N
7036	\N	\N
9980	\N	\N
2719	\N	\N
3024	\N	\N
6829	\N	\N
7706	\N	\N
8675	\N	\N
6959	\N	\N
6009	\N	\N
9495	\N	\N
6923	\N	\N
6757	\N	\N
8215	\N	\N
2781	\N	\N
5532	\N	\N
5688	\N	\N
7502	\N	\N
1700	\N	\N
4906	\N	\N
1450	\N	\N
5861	\N	\N
1651	\N	\N
8317	\N	\N
1093	\N	\N
6385	\N	\N
9868	\N	\N
2110	\N	\N
6450	\N	\N
5485	\N	\N
6793	\N	\N
8819	\N	\N
6970	\N	\N
4044	\N	\N
3632	\N	\N
6879	\N	\N
9412	\N	\N
5531	\N	\N
9141	\N	\N
7646	\N	\N
5479	\N	\N
2057	\N	\N
6156	\N	\N
3814	\N	\N
4035	\N	\N
9955	\N	\N
9444	\N	\N
1666	\N	\N
1580	\N	\N
3140	\N	\N
3124	\N	\N
2292	\N	\N
4516	\N	\N
4330	\N	\N
3717	\N	\N
4455	\N	\N
3246	\N	\N
6971	\N	\N
6198	\N	\N
4010	\N	\N
3008	\N	\N
7119	\N	\N
4129	\N	\N
6169	\N	\N
6314	\N	\N
8361	\N	\N
9094	\N	\N
2751	\N	\N
4225	\N	\N
6030	\N	\N
8281	\N	\N
2868	\N	\N
8552	\N	\N
2809	\N	\N
1930	\N	\N
4898	\N	\N
5869	\N	\N
4261	\N	\N
5109	\N	\N
4660	\N	\N
5026	\N	\N
1907	\N	\N
6826	\N	\N
1616	\N	\N
4971	\N	\N
7955	\N	\N
6897	\N	\N
5825	\N	\N
8993	\N	\N
3573	\N	\N
3897	\N	\N
4202	\N	\N
5456	\N	\N
9429	\N	\N
8351	\N	\N
5318	\N	\N
9653	\N	\N
9127	\N	\N
1474	\N	\N
2076	\N	\N
8441	\N	\N
7771	\N	\N
9308	\N	\N
7012	\N	\N
8541	\N	\N
4268	\N	\N
9932	\N	\N
6886	\N	\N
7461	\N	\N
4782	\N	\N
2706	\N	\N
2901	\N	\N
8175	\N	\N
4918	\N	\N
4532	\N	\N
2135	\N	\N
9195	\N	\N
7936	\N	\N
4358	\N	\N
2651	\N	\N
7042	\N	\N
3857	\N	\N
5239	\N	\N
8600	\N	\N
3005	\N	\N
8605	\N	\N
6027	\N	\N
1726	\N	\N
2800	\N	\N
2639	\N	\N
2768	\N	\N
7262	\N	\N
7805	\N	\N
5471	\N	\N
4177	\N	\N
3312	\N	\N
6972	\N	\N
9460	\N	\N
1522	\N	\N
8692	\N	\N
1518	\N	\N
8298	\N	\N
8954	\N	\N
9820	\N	\N
1127	\N	\N
3325	\N	\N
9778	\N	\N
4013	\N	\N
3691	\N	\N
9630	\N	\N
3379	\N	\N
1642	\N	\N
6380	\N	\N
3908	\N	\N
7882	\N	\N
1336	\N	\N
4716	\N	\N
1891	\N	\N
7379	\N	\N
9089	\N	\N
5019	\N	\N
7181	\N	\N
9641	\N	\N
3430	\N	\N
4130	\N	\N
9911	\N	\N
5420	\N	\N
9552	\N	\N
9443	\N	\N
1802	\N	\N
2429	\N	\N
1491	\N	\N
9302	\N	\N
6567	\N	\N
9196	\N	\N
7088	\N	\N
5666	\N	\N
5558	\N	\N
1482	\N	\N
3661	\N	\N
4389	\N	\N
4272	\N	\N
5723	\N	\N
9880	\N	\N
8898	\N	\N
2619	\N	\N
1882	\N	\N
8935	\N	\N
7538	\N	\N
7708	\N	\N
2648	\N	\N
9852	\N	\N
7093	\N	\N
5986	\N	\N
5048	\N	\N
5598	\N	\N
1317	\N	\N
5194	\N	\N
7003	\N	\N
1396	\N	\N
2646	\N	\N
1586	\N	\N
6298	\N	\N
5409	\N	\N
4087	\N	\N
8424	\N	\N
8020	\N	\N
1800	\N	\N
7481	\N	\N
7455	\N	\N
5398	\N	\N
7435	\N	\N
9216	\N	\N
9920	\N	\N
8519	\N	\N
6112	\N	\N
3253	\N	\N
4798	\N	\N
4338	\N	\N
5656	\N	\N
5617	\N	\N
9709	\N	\N
7344	\N	\N
2514	\N	\N
3619	\N	\N
4764	\N	\N
9348	\N	\N
1329	\N	\N
5534	\N	\N
6671	\N	\N
4805	\N	\N
2199	\N	\N
5172	\N	\N
9036	\N	\N
8521	\N	\N
7837	\N	\N
4124	\N	\N
2279	\N	\N
8995	\N	\N
8085	\N	\N
9011	\N	\N
5497	\N	\N
3011	\N	\N
8128	\N	\N
2462	\N	\N
1364	\N	\N
4212	\N	\N
8636	\N	\N
2818	\N	\N
9357	\N	\N
8303	\N	\N
6758	\N	\N
3549	\N	\N
6938	\N	\N
5235	\N	\N
2446	\N	\N
9756	\N	\N
9553	\N	\N
7330	\N	\N
8174	\N	\N
2773	\N	\N
2617	\N	\N
9882	\N	\N
9914	\N	\N
8184	\N	\N
3893	\N	\N
5074	\N	\N
4568	\N	\N
7209	\N	\N
8828	\N	\N
2836	\N	\N
6691	\N	\N
4941	\N	\N
5330	\N	\N
9923	\N	\N
8054	\N	\N
5536	\N	\N
9873	\N	\N
1563	\N	\N
1489	\N	\N
9059	\N	\N
4219	\N	\N
6078	\N	\N
7388	\N	\N
6656	\N	\N
4639	\N	\N
6364	\N	\N
2303	\N	\N
7299	\N	\N
8513	\N	\N
7116	\N	\N
6788	\N	\N
2178	\N	\N
5573	\N	\N
4496	\N	\N
5102	\N	\N
8135	\N	\N
5044	\N	\N
7759	\N	\N
9126	\N	\N
3805	\N	\N
9252	\N	\N
5240	\N	\N
2533	\N	\N
9815	\N	\N
9435	\N	\N
6173	\N	\N
8232	\N	\N
1824	\N	\N
5508	\N	\N
9385	\N	\N
2578	\N	\N
8967	\N	\N
7452	\N	\N
6525	\N	\N
8611	\N	\N
2949	\N	\N
2302	\N	\N
5673	\N	\N
4602	\N	\N
1415	\N	\N
9556	\N	\N
3010	\N	\N
5343	\N	\N
8543	\N	\N
1744	\N	\N
1530	\N	\N
6724	\N	\N
2941	\N	\N
3723	\N	\N
1696	\N	\N
4377	\N	\N
5962	\N	\N
8415	\N	\N
6898	\N	\N
3263	\N	\N
3518	\N	\N
7294	\N	\N
3653	\N	\N
9677	\N	\N
5543	\N	\N
6307	\N	\N
8027	\N	\N
9603	\N	\N
5186	\N	\N
6013	\N	\N
1080	\N	\N
9856	\N	\N
3852	\N	\N
1328	\N	\N
3753	\N	\N
8515	\N	\N
3044	\N	\N
8590	\N	\N
6458	\N	\N
6416	\N	\N
6211	\N	\N
7912	\N	\N
9414	\N	\N
3849	\N	\N
1323	\N	\N
3155	\N	\N
3435	\N	\N
9501	\N	\N
6050	\N	\N
2712	\N	\N
2606	\N	\N
1162	\N	\N
6544	\N	\N
5541	\N	\N
1001	\N	\N
7579	\N	\N
2107	\N	\N
1950	\N	\N
8653	\N	\N
7514	\N	\N
2232	\N	\N
8594	\N	\N
1926	\N	\N
3348	\N	\N
2682	\N	\N
5375	\N	\N
7451	\N	\N
3264	\N	\N
9033	\N	\N
7171	\N	\N
8219	\N	\N
1434	\N	\N
1534	\N	\N
1933	\N	\N
8419	\N	\N
7129	\N	\N
9084	\N	\N
9965	\N	\N
6927	\N	\N
4744	\N	\N
9798	\N	\N
1652	\N	\N
6037	\N	\N
7482	\N	\N
7657	\N	\N
8932	\N	\N
9968	\N	\N
9037	\N	\N
1307	\N	\N
7905	\N	\N
6820	\N	\N
4101	\N	\N
5029	\N	\N
8444	\N	\N
3406	\N	\N
2129	\N	\N
1105	\N	\N
5436	\N	\N
1803	\N	\N
6122	\N	\N
6496	\N	\N
8121	\N	\N
9014	\N	\N
9700	\N	\N
9410	\N	\N
3883	\N	\N
9449	\N	\N
4879	\N	\N
4953	\N	\N
7904	\N	\N
4396	\N	\N
1932	\N	\N
2517	\N	\N
5275	\N	\N
7431	\N	\N
6642	\N	\N
6033	\N	\N
9402	\N	\N
8544	\N	\N
3006	\N	\N
2662	\N	\N
8559	\N	\N
4497	\N	\N
3283	\N	\N
9455	\N	\N
5925	\N	\N
9560	\N	\N
6860	\N	\N
4205	\N	\N
7753	\N	\N
1349	\N	\N
7327	\N	\N
5902	\N	\N
7421	\N	\N
8812	\N	\N
4634	\N	\N
2339	\N	\N
7558	\N	\N
9193	\N	\N
1185	\N	\N
4383	\N	\N
3721	\N	\N
4719	\N	\N
8178	\N	\N
5517	\N	\N
2524	\N	\N
3422	\N	\N
3969	\N	\N
4876	\N	\N
3982	\N	\N
9342	\N	\N
5384	\N	\N
5565	\N	\N
7376	\N	\N
3311	\N	\N
3375	\N	\N
3423	\N	\N
5041	\N	\N
7571	\N	\N
6741	\N	\N
3238	\N	\N
3437	\N	\N
4636	\N	\N
1617	\N	\N
7533	\N	\N
7691	\N	\N
2075	\N	\N
1086	\N	\N
7621	\N	\N
8041	\N	\N
1956	\N	\N
8779	\N	\N
2546	\N	\N
9801	\N	\N
5228	\N	\N
1746	\N	\N
3913	\N	\N
2222	\N	\N
7199	\N	\N
2012	\N	\N
4216	\N	\N
1076	\N	\N
1493	\N	\N
2766	\N	\N
7511	\N	\N
7259	\N	\N
1143	\N	\N
7348	\N	\N
3300	\N	\N
4050	\N	\N
4695	\N	\N
6275	\N	\N
9261	\N	\N
1467	\N	\N
3927	\N	\N
4659	\N	\N
1903	\N	\N
7518	\N	\N
2389	\N	\N
8816	\N	\N
2934	\N	\N
3625	\N	\N
4428	\N	\N
1442	\N	\N
7720	\N	\N
9589	\N	\N
4513	\N	\N
3726	\N	\N
8621	\N	\N
1141	\N	\N
3838	\N	\N
9197	\N	\N
4858	\N	\N
5990	\N	\N
8572	\N	\N
8718	\N	\N
1095	\N	\N
5788	\N	\N
4922	\N	\N
2728	\N	\N
8727	\N	\N
3925	\N	\N
5480	\N	\N
8274	\N	\N
9931	\N	\N
6840	\N	\N
1346	\N	\N
4371	\N	\N
8106	\N	\N
7991	\N	\N
7390	\N	\N
7260	\N	\N
1270	\N	\N
7757	\N	\N
2811	\N	\N
4523	\N	\N
7296	\N	\N
5046	\N	\N
1265	\N	\N
3091	\N	\N
6608	\N	\N
4977	\N	\N
2678	\N	\N
8724	\N	\N
7315	\N	\N
2713	\N	\N
9101	\N	\N
7602	\N	\N
5657	\N	\N
5877	\N	\N
1177	\N	\N
6168	\N	\N
7564	\N	\N
7540	\N	\N
8481	\N	\N
8986	\N	\N
6754	\N	\N
3976	\N	\N
5918	\N	\N
5640	\N	\N
6201	\N	\N
5739	\N	\N
8787	\N	\N
7309	\N	\N
8945	\N	\N
8580	\N	\N
6003	\N	\N
2459	\N	\N
2534	\N	\N
5401	\N	\N
1793	\N	\N
5253	\N	\N
4515	\N	\N
7840	\N	\N
7572	\N	\N
5755	\N	\N
4315	\N	\N
1350	\N	\N
6710	\N	\N
7587	\N	\N
8571	\N	\N
1136	\N	\N
6223	\N	\N
3200	\N	\N
3468	\N	\N
1999	\N	\N
1640	\N	\N
4836	\N	\N
5502	\N	\N
4697	\N	\N
3978	\N	\N
4975	\N	\N
5238	\N	\N
2392	\N	\N
8204	\N	\N
6588	\N	\N
5105	\N	\N
2562	\N	\N
1754	\N	\N
7743	\N	\N
6019	\N	\N
3641	\N	\N
6174	\N	\N
5883	\N	\N
1615	\N	\N
4301	\N	\N
7918	\N	\N
9125	\N	\N
1557	\N	\N
2305	\N	\N
9132	\N	\N
8805	\N	\N
3018	\N	\N
7474	\N	\N
2495	\N	\N
7156	\N	\N
3781	\N	\N
4495	\N	\N
8001	\N	\N
9362	\N	\N
7074	\N	\N
6643	\N	\N
7915	\N	\N
8610	\N	\N
7864	\N	\N
9298	\N	\N
9850	\N	\N
8568	\N	\N
1034	\N	\N
7592	\N	\N
3796	\N	\N
8862	\N	\N
1031	\N	\N
8958	\N	\N
4307	\N	\N
6085	\N	\N
3164	\N	\N
9505	\N	\N
2765	\N	\N
5648	\N	\N
3947	\N	\N
2695	\N	\N
2971	\N	\N
8464	\N	\N
6120	\N	\N
9257	\N	\N
5203	\N	\N
1501	\N	\N
9544	\N	\N
4525	\N	\N
3445	\N	\N
2479	\N	\N
9183	\N	\N
7043	\N	\N
7544	\N	\N
7789	\N	\N
5261	\N	\N
5353	\N	\N
3568	\N	\N
1290	\N	\N
4828	\N	\N
8854	\N	\N
7569	\N	\N
2010	\N	\N
7532	\N	\N
6342	\N	\N
5676	\N	\N
2928	\N	\N
6408	\N	\N
1804	\N	\N
8825	\N	\N
5093	\N	\N
8157	\N	\N
6379	\N	\N
3670	\N	\N
1668	\N	\N
1870	\N	\N
5092	\N	\N
1986	\N	\N
6010	\N	\N
4127	\N	\N
8094	\N	\N
9636	\N	\N
5258	\N	\N
6922	\N	\N
8368	\N	\N
9661	\N	\N
2441	\N	\N
1269	\N	\N
8738	\N	\N
6833	\N	\N
5624	\N	\N
9715	\N	\N
7623	\N	\N
5884	\N	\N
7056	\N	\N
4211	\N	\N
6722	\N	\N
5058	\N	\N
9061	\N	\N
6046	\N	\N
1335	\N	\N
7175	\N	\N
7483	\N	\N
2946	\N	\N
3272	\N	\N
8664	\N	\N
4863	\N	\N
4967	\N	\N
6285	\N	\N
2215	\N	\N
7748	\N	\N
6453	\N	\N
1818	\N	\N
9447	\N	\N
7624	\N	\N
2416	\N	\N
8349	\N	\N
7754	\N	\N
2338	\N	\N
3631	\N	\N
8720	\N	\N
4938	\N	\N
2884	\N	\N
3365	\N	\N
4925	\N	\N
2779	\N	\N
6748	\N	\N
4195	\N	\N
5722	\N	\N
8308	\N	\N
4776	\N	\N
7792	\N	\N
3467	\N	\N
7382	\N	\N
7598	\N	\N
5605	\N	\N
2433	\N	\N
5581	\N	\N
2970	\N	\N
4002	\N	\N
5609	\N	\N
6977	\N	\N
1280	\N	\N
7013	\N	\N
7979	\N	\N
9813	\N	\N
8029	\N	\N
3373	\N	\N
6323	\N	\N
1381	\N	\N
1959	\N	\N
1321	\N	\N
5450	\N	\N
8562	\N	\N
6068	\N	\N
9424	\N	\N
7080	\N	\N
2795	\N	\N
3609	\N	\N
8433	\N	\N
7030	\N	\N
1498	\N	\N
5707	\N	\N
1731	\N	\N
5900	\N	\N
2156	\N	\N
4095	\N	\N
2058	\N	\N
4499	\N	\N
1531	\N	\N
5511	\N	\N
5037	\N	\N
8160	\N	\N
3652	\N	\N
6507	\N	\N
4708	\N	\N
5931	\N	\N
1181	\N	\N
8856	\N	\N
1233	\N	\N
8748	\N	\N
1486	\N	\N
3056	\N	\N
5737	\N	\N
1412	\N	\N
6073	\N	\N
2142	\N	\N
8245	\N	\N
3938	\N	\N
6253	\N	\N
4367	\N	\N
6179	\N	\N
4120	\N	\N
3177	\N	\N
4426	\N	\N
4540	\N	\N
2738	\N	\N
9475	\N	\N
7541	\N	\N
6459	\N	\N
5257	\N	\N
3784	\N	\N
1393	\N	\N
1515	\N	\N
3143	\N	\N
9076	\N	\N
9997	\N	\N
3284	\N	\N
3588	\N	\N
7203	\N	\N
6723	\N	\N
1089	\N	\N
2689	\N	\N
4215	\N	\N
3045	\N	\N
9295	\N	\N
9793	\N	\N
7672	\N	\N
3879	\N	\N
7076	\N	\N
3590	\N	\N
3498	\N	\N
5816	\N	\N
5821	\N	\N
9619	\N	\N
5377	\N	\N
7878	\N	\N
8585	\N	\N
8495	\N	\N
5633	\N	\N
8848	\N	\N
4278	\N	\N
2027	\N	\N
8167	\N	\N
4052	\N	\N
8574	\N	\N
6892	\N	\N
1124	\N	\N
2752	\N	\N
6789	\N	\N
1277	\N	\N
5806	\N	\N
1245	\N	\N
6582	\N	\N
7625	\N	\N
7101	\N	\N
5661	\N	\N
2474	\N	\N
3922	\N	\N
6776	\N	\N
3509	\N	\N
4682	\N	\N
8511	\N	\N
4392	\N	\N
1464	\N	\N
1426	\N	\N
2586	\N	\N
6540	\N	\N
2558	\N	\N
5337	\N	\N
6264	\N	\N
4237	\N	\N
6729	\N	\N
3110	\N	\N
8490	\N	\N
2158	\N	\N
4076	\N	\N
1647	\N	\N
5268	\N	\N
2659	\N	\N
3025	\N	\N
8079	\N	\N
3082	\N	\N
3388	\N	\N
6852	\N	\N
1693	\N	\N
5281	\N	\N
4290	\N	\N
7929	\N	\N
6950	\N	\N
3473	\N	\N
4683	\N	\N
2388	\N	\N
7226	\N	\N
7724	\N	\N
5934	\N	\N
4852	\N	\N
7329	\N	\N
3003	\N	\N
5440	\N	\N
2642	\N	\N
5077	\N	\N
5465	\N	\N
3432	\N	\N
2733	\N	\N
9673	\N	\N
8560	\N	\N
5555	\N	\N
9097	\N	\N
1508	\N	\N
5650	\N	\N
5952	\N	\N
9510	\N	\N
3111	\N	\N
5206	\N	\N
1138	\N	\N
5794	\N	\N
4860	\N	\N
3851	\N	\N
9178	\N	\N
2030	\N	\N
5373	\N	\N
9783	\N	\N
5458	\N	\N
8597	\N	\N
3820	\N	\N
4521	\N	\N
6693	\N	\N
3650	\N	\N
8959	\N	\N
1735	\N	\N
8723	\N	\N
6189	\N	\N
9753	\N	\N
6983	\N	\N
4109	\N	\N
1318	\N	\N
2320	\N	\N
1624	\N	\N
4849	\N	\N
2286	\N	\N
3846	\N	\N
9760	\N	\N
5196	\N	\N
3566	\N	\N
6015	\N	\N
6836	\N	\N
6363	\N	\N
5463	\N	\N
4944	\N	\N
3426	\N	\N
3860	\N	\N
7319	\N	\N
2425	\N	\N
4787	\N	\N
2444	\N	\N
6876	\N	\N
3332	\N	\N
5731	\N	\N
7484	\N	\N
8752	\N	\N
7902	\N	\N
2529	\N	\N
2001	\N	\N
7898	\N	\N
5551	\N	\N
6890	\N	\N
4589	\N	\N
7324	\N	\N
1928	\N	\N
7557	\N	\N
1255	\N	\N
3535	\N	\N
7526	\N	\N
2404	\N	\N
3403	\N	\N
1922	\N	\N
6218	\N	\N
2092	\N	\N
2641	\N	\N
5927	\N	\N
9502	\N	\N
3759	\N	\N
1913	\N	\N
6349	\N	\N
8234	\N	\N
6239	\N	\N
8405	\N	\N
1875	\N	\N
5423	\N	\N
2493	\N	\N
9563	\N	\N
9471	\N	\N
3237	\N	\N
4222	\N	\N
1359	\N	\N
2435	\N	\N
1352	\N	\N
5781	\N	\N
3370	\N	\N
2318	\N	\N
4756	\N	\N
4501	\N	\N
7633	\N	\N
2847	\N	\N
4463	\N	\N
1113	\N	\N
6249	\N	\N
5758	\N	\N
5478	\N	\N
1374	\N	\N
3696	\N	\N
8185	\N	\N
7499	\N	\N
4673	\N	\N
4986	\N	\N
9539	\N	\N
8017	\N	\N
2055	\N	\N
5814	\N	\N
4562	\N	\N
6859	\N	\N
2904	\N	\N
4651	\N	\N
9897	\N	\N
8324	\N	\N
7478	\N	\N
2081	\N	\N
9111	\N	\N
5247	\N	\N
9802	\N	\N
1227	\N	\N
1428	\N	\N
4132	\N	\N
6175	\N	\N
8730	\N	\N
7017	\N	\N
7656	\N	\N
1039	\N	\N
3656	\N	\N
7873	\N	\N
5340	\N	\N
7578	\N	\N
3907	\N	\N
6374	\N	\N
6135	\N	\N
2735	\N	\N
5428	\N	\N
9685	\N	\N
8689	\N	\N
9939	\N	\N
2177	\N	\N
5569	\N	\N
4662	\N	\N
2247	\N	\N
3444	\N	\N
4446	\N	\N
6586	\N	\N
5953	\N	\N
2014	\N	\N
3252	\N	\N
2295	\N	\N
6440	\N	\N
5357	\N	\N
2867	\N	\N
2042	\N	\N
2089	\N	\N
7393	\N	\N
3872	\N	\N
5191	\N	\N
6681	\N	\N
4143	\N	\N
9787	\N	\N
6589	\N	\N
8089	\N	\N
3418	\N	\N
6248	\N	\N
9095	\N	\N
2866	\N	\N
7097	\N	\N
9669	\N	\N
5460	\N	\N
3029	\N	\N
7375	\N	\N
6254	\N	\N
6419	\N	\N
8279	\N	\N
9561	\N	\N
4804	\N	\N
5096	\N	\N
2491	\N	\N
1592	\N	\N
7443	\N	\N
7064	\N	\N
9326	\N	\N
7242	\N	\N
8374	\N	\N
9895	\N	\N
9625	\N	\N
5575	\N	\N
6471	\N	\N
4743	\N	\N
8101	\N	\N
1978	\N	\N
8299	\N	\N
9015	\N	\N
8888	\N	\N
2643	\N	\N
6755	\N	\N
8436	\N	\N
2325	\N	\N
4590	\N	\N
1732	\N	\N
5432	\N	\N
4183	\N	\N
3012	\N	\N
4145	\N	\N
1182	\N	\N
4421	\N	\N
1678	\N	\N
9617	\N	\N
2570	\N	\N
8260	\N	\N
4256	\N	\N
1590	\N	\N
3675	\N	\N
2823	\N	\N
6274	\N	\N
9179	\N	\N
3433	\N	\N
2742	\N	\N
5628	\N	\N
1262	\N	\N
2287	\N	\N
8231	\N	\N
5802	\N	\N
3654	\N	\N
5956	\N	\N
9523	\N	\N
7851	\N	\N
5192	\N	\N
4255	\N	\N
5691	\N	\N
2101	\N	\N
1728	\N	\N
7126	\N	\N
5644	\N	\N
1085	\N	\N
1419	\N	\N
2669	\N	\N
1036	\N	\N
4661	\N	\N
8922	\N	\N
6559	\N	\N
9983	\N	\N
7196	\N	\N
3885	\N	\N
2386	\N	\N
3538	\N	\N
2219	\N	\N
7354	\N	\N
3874	\N	\N
2009	\N	\N
5483	\N	\N
3033	\N	\N
1845	\N	\N
9569	\N	\N
8073	\N	\N
2939	\N	\N
9227	\N	\N
3944	\N	\N
2520	\N	\N
3767	\N	\N
2953	\N	\N
2519	\N	\N
1618	\N	\N
5736	\N	\N
6919	\N	\N
2849	\N	\N
8463	\N	\N
7020	\N	\N
9946	\N	\N
3788	\N	\N
8123	\N	\N
1250	\N	\N
2250	\N	\N
9888	\N	\N
2455	\N	\N
7982	\N	\N
7491	\N	\N
2100	\N	\N
5388	\N	\N
5997	\N	\N
7236	\N	\N
6443	\N	\N
6134	\N	\N
9792	\N	\N
2711	\N	\N
5837	\N	\N
3001	\N	\N
5097	\N	\N
4875	\N	\N
6192	\N	\N
3955	\N	\N
6437	\N	\N
9771	\N	\N
1247	\N	\N
7377	\N	\N
4472	\N	\N
7647	\N	\N
9904	\N	\N
1481	\N	\N
8447	\N	\N
9228	\N	\N
9474	\N	\N
5852	\N	\N
4072	\N	\N
9090	\N	\N
4362	\N	\N
7990	\N	\N
1927	\N	\N
7875	\N	\N
7910	\N	\N
5024	\N	\N
9726	\N	\N
8627	\N	\N
2146	\N	\N
4373	\N	\N
2876	\N	\N
9260	\N	\N
2274	\N	\N
3839	\N	\N
8412	\N	\N
9671	\N	\N
8434	\N	\N
6565	\N	\N
9428	\N	\N
3949	\N	\N
4172	\N	\N
9360	\N	\N
9333	\N	\N
2829	\N	\N
5263	\N	\N
9697	\N	\N
9704	\N	\N
8459	\N	\N
7009	\N	\N
1224	\N	\N
9814	\N	\N
4174	\N	\N
7833	\N	\N
1445	\N	\N
4672	\N	\N
8214	\N	\N
6219	\N	\N
7213	\N	\N
6084	\N	\N
3122	\N	\N
4023	\N	\N
8537	\N	\N
3071	\N	\N
3985	\N	\N
9765	\N	\N
9731	\N	\N
7637	\N	\N
5859	\N	\N
1756	\N	\N
2066	\N	\N
9174	\N	\N
8953	\N	\N
2231	\N	\N
2358	\N	\N
1289	\N	\N
6386	\N	\N
8665	\N	\N
9236	\N	\N
7021	\N	\N
7239	\N	\N
3488	\N	\N
5294	\N	\N
1582	\N	\N
1770	\N	\N
8684	\N	\N
6345	\N	\N
6097	\N	\N
2136	\N	\N
7096	\N	\N
2257	\N	\N
3197	\N	\N
4867	\N	\N
6787	\N	\N
7008	\N	\N
2003	\N	\N
5030	\N	\N
5137	\N	\N
3828	\N	\N
4161	\N	\N
2783	\N	\N
9654	\N	\N
8699	\N	\N
9486	\N	\N
5623	\N	\N
7923	\N	\N
1473	\N	\N
4119	\N	\N
7563	\N	\N
5591	\N	\N
6814	\N	\N
2930	\N	\N
6865	\N	\N
1106	\N	\N
2490	\N	\N
4133	\N	\N
9601	\N	\N
7648	\N	\N
2224	\N	\N
8009	\N	\N
7924	\N	\N
9543	\N	\N
2187	\N	\N
2226	\N	\N
6377	\N	\N
6620	\N	\N
9900	\N	\N
2895	\N	\N
2592	\N	\N
2238	\N	\N
5134	\N	\N
9532	\N	\N
5313	\N	\N
3719	\N	\N
2311	\N	\N
7110	\N	\N
5159	\N	\N
4582	\N	\N
4200	\N	\N
7406	\N	\N
3112	\N	\N
8345	\N	\N
2049	\N	\N
8057	\N	\N
8645	\N	\N
4665	\N	\N
7273	\N	\N
3409	\N	\N
9782	\N	\N
3797	\N	\N
2024	\N	\N
4797	\N	\N
2173	\N	\N
5738	\N	\N
7180	\N	\N
7279	\N	\N
5070	\N	\N
1608	\N	\N
7995	\N	\N
1866	\N	\N
8165	\N	\N
3350	\N	\N
7641	\N	\N
8114	\N	\N
8885	\N	\N
1236	\N	\N
7725	\N	\N
1382	\N	\N
1925	\N	\N
2065	\N	\N
4888	\N	\N
3964	\N	\N
2634	\N	\N
9065	\N	\N
9684	\N	\N
8309	\N	\N
6797	\N	\N
1849	\N	\N
4295	\N	\N
5499	\N	\N
5904	\N	\N
1512	\N	\N
2321	\N	\N
6733	\N	\N
4331	\N	\N
6194	\N	\N
4192	\N	\N
2615	\N	\N
4066	\N	\N
2591	\N	\N
2281	\N	\N
4644	\N	\N
8145	\N	\N
3364	\N	\N
6087	\N	\N
8194	\N	\N
6094	\N	\N
9849	\N	\N
4448	\N	\N
4579	\N	\N
9462	\N	\N
3455	\N	\N
9470	\N	\N
4265	\N	\N
1007	\N	\N
8068	\N	\N
1940	\N	\N
1315	\N	\N
6528	\N	\N
5392	\N	\N
3193	\N	\N
9211	\N	\N
8408	\N	\N
9829	\N	\N
9310	\N	\N
4175	\N	\N
3153	\N	\N
3207	\N	\N
2620	\N	\N
6703	\N	\N
2792	\N	\N
2341	\N	\N
2419	\N	\N
1729	\N	\N
9452	\N	\N
6997	\N	\N
2347	\N	\N
6241	\N	\N
3051	\N	\N
1630	\N	\N
2040	\N	\N
3977	\N	\N
8774	\N	\N
5895	\N	\N
6108	\N	\N
4505	\N	\N
5107	\N	\N
6022	\N	\N
2574	\N	\N
8882	\N	\N
9821	\N	\N
5341	\N	\N
9651	\N	\N
9060	\N	\N
6224	\N	\N
9292	\N	\N
5680	\N	\N
8072	\N	\N
9274	\N	\N
6215	\N	\N
3254	\N	\N
7395	\N	\N
1539	\N	\N
6373	\N	\N
5929	\N	\N
3593	\N	\N
5141	\N	\N
7729	\N	\N
6250	\N	\N
3307	\N	\N
5604	\N	\N
6284	\N	\N
7108	\N	\N
1765	\N	\N
4901	\N	\N
1722	\N	\N
4970	\N	\N
5527	\N	\N
9808	\N	\N
3126	\N	\N
6460	\N	\N
1348	\N	\N
1028	\N	\N
5433	\N	\N
1527	\N	\N
4718	\N	\N
3819	\N	\N
2251	\N	\N
5245	\N	\N
5002	\N	\N
5836	\N	\N
3278	\N	\N
6150	\N	\N
6764	\N	\N
1110	\N	\N
9329	\N	\N
4738	\N	\N
8141	\N	\N
3245	\N	\N
5978	\N	\N
1298	\N	\N
5133	\N	\N
3983	\N	\N
2745	\N	\N
9393	\N	\N
7618	\N	\N
4812	\N	\N
7836	\N	\N
3420	\N	\N
6889	\N	\N
4954	\N	\N
3328	\N	\N
8538	\N	\N
9430	\N	\N
1043	\N	\N
3113	\N	\N
7449	\N	\N
2036	\N	\N
8076	\N	\N
7109	\N	\N
1706	\N	\N
8643	\N	\N
9583	\N	\N
6039	\N	\N
7559	\N	\N
4025	\N	\N
3236	\N	\N
1659	\N	\N
7219	\N	\N
9287	\N	\N
3836	\N	\N
1155	\N	\N
6328	\N	\N
8892	\N	\N
8120	\N	\N
7953	\N	\N
6756	\N	\N
9249	\N	\N
4580	\N	\N
8486	\N	\N
3084	\N	\N
7983	\N	\N
9545	\N	\N
5489	\N	\N
8452	\N	\N
7089	\N	\N
1554	\N	\N
8115	\N	\N
2950	\N	\N
3541	\N	\N
9550	\N	\N
5654	\N	\N
4453	\N	\N
9152	\N	\N
2233	\N	\N
4197	\N	\N
4163	\N	\N
6336	\N	\N
3760	\N	\N
1116	\N	\N
4494	\N	\N
5154	\N	\N
5123	\N	\N
9738	\N	\N
9341	\N	\N
3136	\N	\N
5807	\N	\N
5036	\N	\N
5891	\N	\N
9741	\N	\N
9300	\N	\N
2482	\N	\N
3504	\N	\N
5354	\N	\N
7609	\N	\N
5913	\N	\N
1755	\N	\N
8546	\N	\N
2368	\N	\N
5791	\N	\N
3047	\N	\N
4199	\N	\N
3279	\N	\N
6111	\N	\N
5705	\N	\N
4232	\N	\N
9083	\N	\N
2879	\N	\N
9795	\N	\N
9009	\N	\N
3387	\N	\N
5703	\N	\N
7245	\N	\N
2589	\N	\N
7496	\N	\N
9877	\N	\N
8040	\N	\N
5977	\N	\N
6809	\N	\N
2487	\N	\N
7249	\N	\N
1308	\N	\N
7987	\N	\N
5975	\N	\N
2344	\N	\N
6982	\N	\N
9434	\N	\N
7135	\N	\N
4038	\N	\N
3708	\N	\N
3688	\N	\N
8980	\N	\N
4528	\N	\N
3848	\N	\N
3398	\N	\N
3339	\N	\N
3446	\N	\N
2467	\N	\N
2860	\N	\N
7745	\N	\N
8677	\N	\N
4962	\N	\N
9337	\N	\N
1120	\N	\N
6637	\N	\N
3800	\N	\N
3215	\N	\N
5264	\N	\N
8697	\N	\N
1588	\N	\N
8019	\N	\N
9702	\N	\N
7006	\N	\N
3314	\N	\N
7577	\N	\N
2391	\N	\N
9513	\N	\N
2666	\N	\N
4536	\N	\N
5553	\N	\N
8180	\N	\N
4573	\N	\N
8301	\N	\N
2366	\N	\N
4207	\N	\N
9096	\N	\N
1108	\N	\N
3231	\N	\N
5315	\N	\N
4282	\N	\N
3813	\N	\N
4795	\N	\N
6547	\N	\N
6426	\N	\N
2102	\N	\N
8722	\N	\N
9268	\N	\N
6518	\N	\N
9776	\N	\N
1051	\N	\N
4366	\N	\N
4821	\N	\N
2123	\N	\N
9626	\N	\N
1733	\N	\N
6918	\N	\N
5443	\N	\N
9699	\N	\N
6639	\N	\N
9325	\N	\N
9225	\N	\N
8023	\N	\N
5817	\N	\N
5915	\N	\N
3635	\N	\N
5607	\N	\N
3704	\N	\N
4226	\N	\N
6742	\N	\N
7268	\N	\N
6352	\N	\N
4271	\N	\N
6659	\N	\N
3060	\N	\N
3548	\N	\N
2464	\N	\N
2572	\N	\N
6330	\N	\N
6907	\N	\N
5316	\N	\N
6178	\N	\N
7922	\N	\N
8963	\N	\N
3799	\N	\N
4641	\N	\N
6091	\N	\N
2400	\N	\N
3959	\N	\N
6423	\N	\N
5302	\N	\N
9491	\N	\N
3371	\N	\N
7347	\N	\N
1695	\N	\N
1781	\N	\N
6115	\N	\N
9143	\N	\N
9173	\N	\N
5042	\N	\N
9299	\N	\N
4094	\N	\N
4022	\N	\N
4752	\N	\N
2153	\N	\N
5174	\N	\N
4924	\N	\N
3917	\N	\N
3415	\N	\N
8512	\N	\N
5475	\N	\N
5518	\N	\N
8961	\N	\N
5963	\N	\N
9889	\N	\N
6417	\N	\N
2968	\N	\N
2039	\N	\N
8193	\N	\N
7351	\N	\N
1778	\N	\N
9602	\N	\N
8488	\N	\N
1576	\N	\N
9962	\N	\N
6750	\N	\N
4892	\N	\N
7897	\N	\N
4985	\N	\N
6432	\N	\N
3182	\N	\N
4739	\N	\N
9405	\N	\N
6994	\N	\N
3416	\N	\N
9408	\N	\N
8656	\N	\N
8355	\N	\N
8033	\N	\N
5155	\N	\N
8873	\N	\N
4542	\N	\N
6925	\N	\N
5716	\N	\N
6926	\N	\N
6604	\N	\N
4492	\N	\N
9316	\N	\N
6687	\N	\N
4640	\N	\N
4878	\N	\N
4961	\N	\N
3248	\N	\N
7241	\N	\N
5526	\N	\N
6222	\N	\N
7820	\N	\N
7372	\N	\N
8494	\N	\N
5259	\N	\N
5116	\N	\N
6255	\N	\N
5003	\N	\N
8139	\N	\N
8043	\N	\N
1020	\N	\N
8153	\N	\N
1809	\N	\N
6451	\N	\N
5613	\N	\N
9013	\N	\N
2920	\N	\N
4414	\N	\N
7214	\N	\N
2357	\N	\N
6072	\N	\N
9806	\N	\N
3706	\N	\N
4280	\N	\N
6766	\N	\N
3889	\N	\N
2069	\N	\N
4578	\N	\N
1142	\N	\N
6172	\N	\N
8326	\N	\N
9203	\N	\N
8502	\N	\N
2803	\N	\N
7359	\N	\N
5713	\N	\N
5445	\N	\N
6024	\N	\N
7570	\N	\N
1939	\N	\N
2165	\N	\N
8393	\N	\N
1074	\N	\N
1904	\N	\N
6291	\N	\N
8916	\N	\N
1884	\N	\N
9166	\N	\N
9587	\N	\N
6988	\N	\N
4541	\N	\N
6403	\N	\N
3602	\N	\N
4430	\N	\N
9599	\N	\N
3257	\N	\N
6041	\N	\N
6464	\N	\N
5863	\N	\N
6772	\N	\N
4317	\N	\N
6816	\N	\N
6164	\N	\N
5284	\N	\N
1107	\N	\N
5752	\N	\N
6684	\N	\N
8211	\N	\N
3258	\N	\N
9045	\N	\N
9349	\N	\N
1157	\N	\N
7576	\N	\N
7305	\N	\N
7508	\N	\N
2025	\N	\N
5379	\N	\N
3297	\N	\N
6781	\N	\N
5798	\N	\N
6159	\N	\N
6941	\N	\N
1801	\N	\N
8032	\N	\N
9220	\N	\N
4751	\N	\N
2275	\N	\N
1748	\N	\N
1026	\N	\N
3792	\N	\N
3072	\N	\N
7853	\N	\N
6775	\N	\N
2011	\N	\N
4800	\N	\N
6228	\N	\N
9201	\N	\N
3611	\N	\N
9401	\N	\N
9181	\N	\N
6372	\N	\N
9689	\N	\N
8438	\N	\N
8182	\N	\N
1081	\N	\N
2235	\N	\N
2062	\N	\N
7880	\N	\N
2807	\N	\N
1484	\N	\N
7310	\N	\N
3477	\N	\N
7940	\N	\N
1542	\N	\N
5687	\N	\N
7204	\N	\N
7911	\N	\N
7301	\N	\N
4106	\N	\N
9121	\N	\N
7519	\N	\N
5468	\N	\N
3341	\N	\N
3131	\N	\N
6716	\N	\N
4914	\N	\N
2166	\N	\N
7710	\N	\N
9711	\N	\N
4895	\N	\N
1325	\N	\N
8468	\N	\N
6370	\N	\N
9185	\N	\N
7795	\N	\N
3400	\N	\N
7384	\N	\N
1217	\N	\N
3903	\N	\N
8099	\N	\N
4820	\N	\N
2607	\N	\N
9686	\N	\N
1239	\N	\N
2160	\N	\N
1989	\N	\N
7735	\N	\N
2877	\N	\N
5853	\N	\N
4535	\N	\N
3638	\N	\N
4940	\N	\N
5220	\N	\N
3794	\N	\N
5548	\N	\N
6998	\N	\N
5360	\N	\N
2744	\N	\N
1923	\N	\N
2834	\N	\N
8337	\N	\N
4036	\N	\N
1199	\N	\N
5516	\N	\N
2887	\N	\N
7456	\N	\N
9433	\N	\N
8280	\N	\N
9450	\N	\N
8210	\N	\N
5641	\N	\N
7385	\N	\N
6697	\N	\N
6552	\N	\N
3331	\N	\N
2857	\N	\N
2141	\N	\N
7407	\N	\N
2023	\N	\N
4591	\N	\N
4408	\N	\N
7053	\N	\N
3569	\N	\N
6500	\N	\N
8188	\N	\N
2037	\N	\N
8978	\N	\N
5326	\N	\N
6831	\N	\N
3818	\N	\N
9050	\N	\N
5973	\N	\N
8711	\N	\N
2016	\N	\N
4671	\N	\N
7007	\N	\N
1258	\N	\N
2593	\N	\N
1751	\N	\N
1490	\N	\N
3806	\N	\N
7794	\N	\N
4930	\N	\N
4612	\N	\N
4745	\N	\N
7358	\N	\N
9031	\N	\N
6240	\N	\N
1840	\N	\N
1553	\N	\N
5955	\N	\N
7411	\N	\N
9809	\N	\N
5647	\N	\N
1499	\N	\N
1601	\N	\N
3260	\N	\N
9947	\N	\N
4060	\N	\N
7113	\N	\N
4558	\N	\N
3878	\N	\N
2256	\N	\N
2440	\N	\N
4030	\N	\N
6615	\N	\N
3349	\N	\N
8989	\N	\N
6987	\N	\N
1038	\N	\N
1782	\N	\N
1620	\N	\N
5314	\N	\N
5368	\N	\N
7705	\N	\N
7965	\N	\N
5568	\N	\N
7963	\N	\N
5446	\N	\N
5234	\N	\N
5197	\N	\N
5395	\N	\N
2280	\N	\N
1140	\N	\N
7167	\N	\N
9100	\N	\N
3698	\N	\N
7472	\N	\N
2468	\N	\N
2613	\N	\N
9478	\N	\N
8445	\N	\N
1027	\N	\N
4642	\N	\N
9758	\N	\N
2959	\N	\N
2476	\N	\N
5971	\N	\N
5339	\N	\N
9427	\N	\N
5249	\N	\N
9163	\N	\N
5639	\N	\N
5103	\N	\N
2351	\N	\N
3861	\N	\N
1459	\N	\N
4622	\N	\N
2721	\N	\N
3915	\N	\N
5631	\N	\N
7215	\N	\N
2276	\N	\N
8672	\N	\N
5545	\N	\N
3725	\N	\N
5744	\N	\N
8365	\N	\N
1599	\N	\N
6644	\N	\N
5328	\N	\N
5066	\N	\N
3821	\N	\N
8446	\N	\N
1431	\N	\N
4946	\N	\N
9139	\N	\N
7807	\N	\N
7062	\N	\N
5198	\N	\N
3520	\N	\N
3629	\N	\N
7333	\N	\N
5954	\N	\N
9721	\N	\N
4993	\N	\N
1511	\N	\N
7849	\N	\N
7283	\N	\N
1872	\N	\N
6141	\N	\N
6446	\N	\N
6103	\N	\N
4343	\N	\N
2905	\N	\N
3402	\N	\N
9736	\N	\N
9799	\N	\N
4746	\N	\N
1011	\N	\N
1068	\N	\N
4485	\N	\N
8253	\N	\N
8333	\N	\N
4131	\N	\N
7060	\N	\N
3168	\N	\N
5045	\N	\N
2411	\N	\N
6635	\N	\N
1344	\N	\N
4846	\N	\N
1312	\N	\N
8098	\N	\N
5335	\N	\N
6911	\N	\N
1639	\N	\N
8109	\N	\N
8407	\N	\N
5768	\N	\N
8628	\N	\N
9135	\N	\N
6079	\N	\N
9970	\N	\N
2677	\N	\N
8573	\N	\N
3714	\N	\N
4645	\N	\N
8520	\N	\N
1282	\N	\N
5273	\N	\N
6696	\N	\N
7228	\N	\N
7856	\N	\N
4638	\N	\N
2580	\N	\N
4123	\N	\N
3046	\N	\N
4019	\N	\N
3993	\N	\N
6790	\N	\N
6841	\N	\N
6801	\N	\N
9106	\N	\N
8051	\N	\N
8223	\N	\N
4159	\N	\N
5620	\N	\N
6843	\N	\N
9463	\N	\N
5849	\N	\N
4339	\N	\N
8111	\N	\N
6449	\N	\N
2171	\N	\N
5792	\N	\N
1906	\N	\N
1613	\N	\N
2260	\N	\N
5785	\N	\N
3580	\N	\N
1152	\N	\N
7136	\N	\N
2947	\N	\N
9740	\N	\N
8084	\N	\N
6001	\N	\N
6579	\N	\N
4142	\N	\N
5926	\N	\N
8375	\N	\N
3628	\N	\N
3637	\N	\N
7830	\N	\N
5383	\N	\N
2489	\N	\N
4537	\N	\N
8095	\N	\N
8632	\N	\N
8830	\N	\N
9294	\N	\N
1905	\N	\N
5741	\N	\N
9664	\N	\N
6213	\N	\N
8951	\N	\N
9921	\N	\N
7386	\N	\N
4633	\N	\N
2956	\N	\N
5772	\N	\N
3216	\N	\N
4357	\N	\N
1537	\N	\N
1954	\N	\N
2109	\N	\N
7604	\N	\N
3195	\N	\N
4270	\N	\N
2103	\N	\N
3062	\N	\N
2512	\N	\N
4277	\N	\N
8008	\N	\N
3526	\N	\N
2056	\N	\N
7818	\N	\N
3952	\N	\N
7534	\N	\N
5210	\N	\N
4293	\N	\N
5323	\N	\N
8913	\N	\N
3265	\N	\N
9930	\N	\N
5211	\N	\N
7949	\N	\N
6617	\N	\N
4209	\N	\N
3489	\N	\N
1815	\N	\N
1211	\N	\N
6503	\N	\N
5803	\N	\N
4479	\N	\N
5968	\N	\N
4150	\N	\N
5370	\N	\N
1302	\N	\N
3116	\N	\N
3627	\N	\N
1195	\N	\N
4714	\N	\N
1981	\N	\N
7010	\N	\N
1711	\N	\N
4372	\N	\N
2179	\N	\N
1494	\N	\N
5944	\N	\N
6857	\N	\N
3227	\N	\N
1646	\N	\N
1878	\N	\N
5255	\N	\N
8261	\N	\N
1100	\N	\N
2684	\N	\N
3564	\N	\N
9378	\N	\N
4810	\N	\N
2762	\N	\N
9665	\N	\N
7984	\N	\N
7290	\N	\N
9695	\N	\N
2526	\N	\N
6095	\N	\N
4885	\N	\N
6210	\N	\N
8418	\N	\N
7079	\N	\N
1650	\N	\N
4170	\N	\N
8525	\N	\N
2367	\N	\N
7000	\N	\N
4078	\N	\N
7270	\N	\N
6191	\N	\N
9683	\N	\N
2035	\N	\N
3777	\N	\N
7516	\N	\N
5561	\N	\N
1056	\N	\N
6391	\N	\N
3700	\N	\N
1984	\N	\N
1194	\N	\N
3414	\N	\N
1198	\N	\N
9128	\N	\N
2932	\N	\N
8940	\N	\N
7507	\N	\N
3773	\N	\N
6413	\N	\N
1189	\N	\N
9990	\N	\N
5061	\N	\N
7823	\N	\N
2923	\N	\N
2225	\N	\N
9305	\N	\N
3288	\N	\N
7712	\N	\N
1957	\N	\N
5965	\N	\N
1386	\N	\N
3120	\N	\N
8477	\N	\N
3274	\N	\N
6066	\N	\N
4229	\N	\N
9297	\N	\N
3160	\N	\N
9995	\N	\N
7582	\N	\N
6942	\N	\N
1665	\N	\N
9440	\N	\N
5333	\N	\N
8323	\N	\N
4715	\N	\N
6076	\N	\N
4400	\N	\N
4570	\N	\N
4053	\N	\N
8780	\N	\N
7276	\N	\N
5830	\N	\N
5689	\N	\N
2296	\N	\N
7028	\N	\N
6849	\N	\N
8096	\N	\N
8171	\N	\N
8844	\N	\N
2998	\N	\N
6625	\N	\N
9207	\N	\N
6029	\N	\N
4693	\N	\N
8451	\N	\N
5126	\N	\N
8746	\N	\N
9763	\N	\N
2151	\N	\N
8129	\N	\N
4955	\N	\N
4466	\N	\N
2952	\N	\N
1327	\N	\N
4866	\N	\N
3855	\N	\N
6355	\N	\N
1558	\N	\N
1597	\N	\N
1010	\N	\N
7146	\N	\N
1156	\N	\N
4137	\N	\N
3273	\N	\N
6921	\N	\N
1121	\N	\N
3492	\N	\N
5073	\N	\N
9624	\N	\N
7018	\N	\N
9448	\N	\N
9161	\N	\N
4281	\N	\N
8482	\N	\N
8549	\N	\N
4164	\N	\N
6649	\N	\N
2507	\N	\N
1513	\N	\N
4678	\N	\N
5587	\N	\N
2749	\N	\N
8428	\N	\N
7216	\N	\N
4289	\N	\N
9237	\N	\N
1953	\N	\N
6903	\N	\N
1058	\N	\N
3787	\N	\N
6020	\N	\N
7942	\N	\N
7509	\N	\N
9597	\N	\N
5780	\N	\N
3514	\N	\N
7751	\N	\N
3251	\N	\N
5522	\N	\N
7137	\N	\N
2121	\N	\N
9648	\N	\N
8802	\N	\N
9321	\N	\N
1551	\N	\N
1054	\N	\N
9812	\N	\N
5232	\N	\N
8931	\N	\N
6195	\N	\N
8915	\N	\N
4703	\N	\N
1388	\N	\N
1737	\N	\N
5444	\N	\N
2693	\N	\N
8533	\N	\N
1047	\N	\N
1759	\N	\N
8602	\N	\N
8340	\N	\N
7867	\N	\N
6247	\N	\N
4459	\N	\N
4210	\N	\N
6497	\N	\N
4830	\N	\N
7616	\N	\N
6842	\N	\N
3934	\N	\N
4181	\N	\N
9858	\N	\N
1622	\N	\N
5601	\N	\N
4935	\N	\N
9088	\N	\N
6359	\N	\N
4530	\N	\N
3206	\N	\N
9136	\N	\N
6549	\N	\N
4791	\N	\N
6499	\N	\N
6689	\N	\N
8781	\N	\N
4379	\N	\N
7644	\N	\N
8394	\N	\N
8456	\N	\N
9855	\N	\N
5923	\N	\N
1796	\N	\N
9898	\N	\N
3156	\N	\N
8714	\N	\N
9881	\N	\N
6855	\N	\N
4788	\N	\N
8626	\N	\N
6676	\N	\N
9714	\N	\N
5149	\N	\N
4299	\N	\N
1825	\N	\N
8050	\N	\N
4240	\N	\N
3301	\N	\N
6158	\N	\N
1309	\N	\N
9768	\N	\N
6325	\N	\N
9288	\N	\N
8558	\N	\N
6106	\N	\N
8296	\N	\N
9330	\N	\N
9137	\N	\N
3607	\N	\N
9836	\N	\N
7517	\N	\N
3275	\N	\N
4081	\N	\N
4206	\N	\N
9177	\N	\N
3107	\N	\N
5017	\N	\N
7790	\N	\N
7505	\N	\N
7115	\N	\N
4675	\N	\N
7589	\N	\N
9213	\N	\N
4625	\N	\N
8289	\N	\N
5321	\N	\N
2169	\N	\N
1422	\N	\N
9635	\N	\N
6677	\N	\N
6654	\N	\N
5726	\N	\N
9419	\N	\N
9976	\N	\N
8909	\N	\N
4098	\N	\N
5671	\N	\N
5094	\N	\N
7906	\N	\N
4627	\N	\N
4934	\N	\N
5016	\N	\N
6900	\N	\N
3093	\N	\N
1821	\N	\N
8061	\N	\N
5153	\N	\N
8531	\N	\N
8992	\N	\N
3175	\N	\N
3368	\N	\N
9259	\N	\N
8813	\N	\N
9465	\N	\N
5007	\N	\N
7387	\N	\N
3804	\N	\N
2430	\N	\N
2585	\N	\N
8662	\N	\N
8893	\N	\N
5055	\N	\N
4001	\N	\N
6412	\N	\N
5387	\N	\N
5160	\N	\N
2289	\N	\N
8987	\N	\N
5808	\N	\N
8147	\N	\N
1365	\N	\N
7813	\N	\N
7978	\N	\N
8868	\N	\N
4868	\N	\N
7901	\N	\N
7555	\N	\N
5336	\N	\N
7033	\N	\N
8765	\N	\N
2525	\N	\N
6429	\N	\N
3642	\N	\N
9010	\N	\N
9805	\N	\N
9275	\N	\N
4874	\N	\N
7892	\N	\N
2911	\N	\N
6568	\N	\N
3230	\N	\N
9842	\N	\N
8838	\N	\N
7703	\N	\N
8268	\N	\N
8104	\N	\N
6930	\N	\N
6476	\N	\N
8791	\N	\N
7466	\N	\N
2105	\N	\N
6420	\N	\N
5466	\N	\N
1221	\N	\N
6514	\N	\N
4032	\N	\N
7244	\N	\N
7350	\N	\N
4337	\N	\N
9409	\N	\N
8460	\N	\N
7433	\N	\N
5322	\N	\N
9993	\N	\N
4667	\N	\N
4461	\N	\N
4543	\N	\N
3746	\N	\N
6650	\N	\N
1521	\N	\N
3417	\N	\N
1742	\N	\N
5745	\N	\N
5087	\N	\N
7799	\N	\N
8751	\N	\N
5419	\N	\N
7195	\N	\N
6866	\N	\N
7264	\N	\N
6396	\N	\N
2563	\N	\N
5777	\N	\N
1168	\N	\N
8353	\N	\N
4434	\N	\N
2902	\N	\N
5523	\N	\N
6679	\N	\N
1707	\N	\N
2938	\N	\N
6613	\N	\N
6271	\N	\N
6726	\N	\N
5848	\N	\N
6655	\N	\N
5219	\N	\N
9073	\N	\N
7870	\N	\N
1951	\N	\N
4326	\N	\N
8865	\N	\N
3778	\N	\N
2291	\N	\N
3831	\N	\N
1443	\N	\N
8710	\N	\N
2018	\N	\N
6477	\N	\N
6834	\N	\N
1478	\N	\N
9728	\N	\N
5583	\N	\N
5828	\N	\N
3138	\N	\N
8321	\N	\N
1833	\N	\N
9000	\N	\N
9786	\N	\N
3079	\N	\N
5835	\N	\N
4883	\N	\N
4817	\N	\N
1102	\N	\N
5207	\N	\N
1133	\N	\N
3381	\N	\N
1863	\N	\N
5786	\N	\N
8318	\N	\N
8983	\N	\N
9264	\N	\N
6362	\N	\N
3145	\N	\N
4826	\N	\N
1475	\N	\N
4969	\N	\N
6463	\N	\N
2369	\N	\N
8282	\N	\N
8297	\N	\N
6607	\N	\N
2393	\N	\N
8545	\N	\N
8839	\N	\N
6895	\N	\N
1191	\N	\N
7476	\N	\N
7291	\N	\N
2355	\N	\N
8726	\N	\N
9907	\N	\N
7422	\N	\N
1584	\N	\N
8168	\N	\N
6674	\N	\N
2205	\N	\N
2528	\N	\N
3203	\N	\N
6287	\N	\N
3581	\N	\N
2501	\N	\N
4529	\N	\N
4696	\N	\N
3864	\N	\N
4770	\N	\N
2094	\N	\N
8022	\N	\N
5756	\N	\N
4896	\N	\N
3764	\N	\N
9140	\N	\N
8542	\N	\N
9747	\N	\N
6584	\N	\N
7871	\N	\N
6701	\N	\N
6294	\N	\N
2748	\N	\N
3499	\N	\N
5115	\N	\N
1069	\N	\N
1510	\N	\N
2691	\N	\N
7713	\N	\N
4841	\N	\N
8069	\N	\N
8981	\N	\N
6782	\N	\N
4511	\N	\N
6993	\N	\N
3916	\N	\N
3690	\N	\N
8682	\N	\N
5262	\N	\N
3578	\N	\N
5530	\N	\N
7365	\N	\N
1151	\N	\N
2999	\N	\N
9387	\N	\N
7711	\N	\N
7229	\N	\N
2120	\N	\N
8631	\N	\N
1725	\N	\N
5081	\N	\N
8207	\N	\N
6320	\N	\N
6315	\N	\N
6430	\N	\N
4552	\N	\N
6035	\N	\N
8761	\N	\N
1691	\N	\N
6706	\N	\N
9416	\N	\N
7128	\N	\N
2021	\N	\N
6132	\N	\N
9762	\N	\N
1581	\N	\N
9717	\N	\N
3235	\N	\N
1320	\N	\N
5709	\N	\N
8744	\N	\N
3121	\N	\N
7640	\N	\N
4608	\N	\N
4796	\N	\N
2364	\N	\N
5304	\N	\N
9652	\N	\N
8760	\N	\N
8152	\N	\N
6951	\N	\N
8067	\N	\N
3183	\N	\N
8200	\N	\N
1468	\N	\N
3114	\N	\N
4702	\N	\N
5935	\N	\N
3171	\N	\N
1338	\N	\N
6183	\N	\N
3291	\N	\N
4932	\N	\N
2470	\N	\N
5223	\N	\N
4082	\N	\N
9205	\N	\N
5779	\N	\N
8350	\N	\N
1631	\N	\N
7782	\N	\N
8267	\N	\N
3942	\N	\N
9160	\N	\N
6269	\N	\N
7585	\N	\N
1896	\N	\N
7253	\N	\N
3186	\N	\N
8524	\N	\N
7969	\N	\N
1996	\N	\N
9837	\N	\N
6089	\N	\N
6744	\N	\N
1898	\N	\N
5840	\N	\N
1593	\N	\N
9575	\N	\N
7781	\N	\N
8534	\N	\N
8964	\N	\N
9142	\N	\N
5491	\N	\N
1970	\N	\N
5498	\N	\N
2383	\N	\N
2244	\N	\N
1573	\N	\N
8313	\N	\N
1410	\N	\N
7980	\N	\N
5922	\N	\N
7601	\N	\N
4950	\N	\N
7424	\N	\N
2513	\N	\N
5945	\N	\N
8316	\N	\N
1788	\N	\N
1920	\N	\N
8432	\N	\N
7416	\N	\N
9610	\N	\N
1342	\N	\N
8581	\N	\N
2315	\N	\N
8607	\N	\N
9933	\N	\N
7381	\N	\N
7250	\N	\N
2767	\N	\N
3108	\N	\N
2645	\N	\N
9105	\N	\N
2900	\N	\N
2842	\N	\N
1936	\N	\N
6964	\N	\N
4694	\N	\N
2203	\N	\N
8265	\N	\N
3689	\N	\N
7289	\N	\N
7810	\N	\N
1006	\N	\N
3162	\N	\N
6913	\N	\N
2940	\N	\N
5595	\N	\N
6187	\N	\N
2310	\N	\N
1797	\N	\N
9518	\N	\N
9529	\N	\N
8336	\N	\N
9835	\N	\N
3286	\N	\N
6901	\N	\N
4733	\N	\N
2594	\N	\N
8874	\N	\N
2890	\N	\N
1418	\N	\N
5299	\N	\N
3354	\N	\N
8550	\N	\N
6657	\N	\N
8338	\N	\N
2340	\N	\N
5715	\N	\N
6854	\N	\N
1760	\N	\N
5472	\N	\N
7702	\N	\N
2756	\N	\N
1856	\N	\N
5338	\N	\N
6732	\N	\N
3030	\N	\N
8127	\N	\N
1715	\N	\N
3150	\N	\N
6791	\N	\N
4069	\N	\N
1103	\N	\N
4456	\N	\N
1000	\N	\N
5396	\N	\N
3352	\N	\N
7059	\N	\N
3483	\N	\N
5614	\N	\N
4491	\N	\N
3559	\N	\N
5246	\N	\N
4418	\N	\N
6536	\N	\N
9296	\N	\N
2283	\N	\N
9694	\N	\N
2667	\N	\N
1094	\N	\N
3926	\N	\N
6116	\N	\N
4363	\N	\N
2536	\N	\N
6026	\N	\N
3199	\N	\N
1847	\N	\N
8197	\N	\N
2885	\N	\N
9226	\N	\N
1958	\N	\N
3664	\N	\N
4241	\N	\N
3115	\N	\N
8510	\N	\N
3521	\N	\N
4051	\N	\N
9093	\N	\N
1379	\N	\N
5938	\N	\N
9929	\N	\N
8815	\N	\N
7152	\N	\N
8013	\N	\N
3840	\N	\N
2848	\N	\N
6893	\N	\N
2206	\N	\N
1973	\N	\N
4773	\N	\N
1334	\N	\N
4705	\N	\N
9785	\N	\N
2378	\N	\N
6126	\N	\N
2541	\N	\N
5685	\N	\N
4244	\N	\N
5146	\N	\N
7210	\N	\N
4422	\N	\N
9347	\N	\N
8143	\N	\N
6301	\N	\N
4100	\N	\N
3202	\N	\N
7664	\N	\N
1268	\N	\N
2183	\N	\N
7104	\N	\N
2407	\N	\N
7086	\N	\N
6916	\N	\N
7428	\N	\N
6685	\N	\N
3752	\N	\N
1273	\N	\N
3984	\N	\N
8691	\N	\N
7237	\N	\N
4512	\N	\N
9232	\N	\N
9130	\N	\N
1632	\N	\N
8087	\N	\N
3786	\N	\N
1287	\N	\N
6712	\N	\N
2147	\N	\N
3582	\N	\N
4803	\N	\N
5864	\N	\N
1004	\N	\N
8817	\N	\N
9537	\N	\N
6694	\N	\N
4963	\N	\N
3837	\N	\N
9007	\N	\N
4429	\N	\N
3811	\N	\N
9124	\N	\N
3945	\N	\N
6628	\N	\N
4840	\N	\N
2957	\N	\N
1337	\N	\N
7106	\N	\N
4242	\N	\N
7057	\N	\N
9867	\N	\N
6896	\N	\N
9670	\N	\N
9464	\N	\N
7067	\N	\N
2060	\N	\N
9214	\N	\N
8220	\N	\N
8485	\N	\N
1637	\N	\N
1288	\N	\N
4263	\N	\N
5300	\N	\N
1411	\N	\N
7883	\N	\N
3228	\N	\N
6145	\N	\N
7230	\N	\N
5369	\N	\N
7148	\N	\N
8506	\N	\N
4894	\N	\N
8929	\N	\N
6610	\N	\N
9272	\N	\N
2559	\N	\N
9522	\N	\N
4606	\N	\N
5787	\N	\N
1376	\N	\N
2629	\N	\N
3640	\N	\N
8426	\N	\N
9024	\N	\N
5580	\N	\N
8221	\N	\N
3023	\N	\N
7855	\N	\N
8471	\N	\N
9005	\N	\N
5662	\N	\N
3519	\N	\N
2413	\N	\N
8430	\N	\N
3074	\N	\N
3081	\N	\N
2194	\N	\N
9335	\N	\N
1077	\N	\N
6529	\N	\N
7234	\N	\N
3660	\N	\N
9611	\N	\N
2365	\N	\N
8416	\N	\N
1257	\N	\N
2155	\N	\N
5625	\N	\N
2028	\N	\N
2621	\N	\N
9080	\N	\N
1073	\N	\N
9168	\N	\N
4493	\N	\N
3900	\N	\N
2376	\N	\N
7073	\N	\N
4284	\N	\N
8920	\N	\N
3184	\N	\N
5486	\N	\N
4117	\N	\N
1005	\N	\N
9289	\N	\N
9397	\N	\N
7004	\N	\N
8305	\N	\N
8222	\N	\N
6414	\N	\N
4912	\N	\N
3920	\N	\N
4762	\N	\N
5727	\N	\N
7768	\N	\N
3707	\N	\N
6146	\N	\N
9129	\N	\N
5043	\N	\N
4783	\N	\N
8391	\N	\N
8569	\N	\N
3340	\N	\N
3533	\N	\N
6025	\N	\N
1792	\N	\N
9716	\N	\N
4300	\N	\N
4730	\N	\N
1776	\N	\N
6806	\N	\N
1343	\N	\N
7845	\N	\N
2185	\N	\N
7485	\N	\N
2769	\N	\N
3513	\N	\N
9044	\N	\N
4308	\N	\N
2362	\N	\N
9053	\N	\N
5759	\N	\N
5145	\N	\N
4288	\N	\N
7220	\N	\N
5051	\N	\N
9848	\N	\N
8074	\N	\N
3442	\N	\N
2269	\N	\N
7832	\N	\N
6837	\N	\N
7295	\N	\N
6153	\N	\N
4864	\N	\N
9331	\N	\N
5101	\N	\N
5874	\N	\N
2571	\N	\N
9999	\N	\N
3561	\N	\N
6407	\N	\N
7967	\N	\N
6940	\N	\N
4994	\N	\N
6261	\N	\N
8224	\N	\N
5542	\N	\N
2434	\N	\N
9072	\N	\N
1205	\N	\N
9826	\N	\N
6289	\N	\N
6318	\N	\N
5932	\N	\N
9774	\N	\N
3898	\N	\N
5589	\N	\N
3676	\N	\N
1982	\N	\N
1119	\N	\N
1895	\N	\N
4621	\N	\N
2637	\N	\N
3386	\N	\N
1868	\N	\N
2599	\N	\N
4264	\N	\N
6327	\N	\N
3960	\N	\N
5751	\N	\N
6436	\N	\N
1578	\N	\N
1697	\N	\N
5158	\N	\N
6480	\N	\N
9646	\N	\N
9180	\N	\N
7543	\N	\N
4510	\N	\N
5712	\N	\N
7217	\N	\N
2164	\N	\N
2780	\N	\N
2370	\N	\N
9986	\N	\N
3219	\N	\N
3930	\N	\N
9691	\N	\N
3962	\N	\N
8372	\N	\N
1713	\N	\N
8295	\N	\N
2337	\N	\N
8484	\N	\N
2786	\N	\N
5907	\N	\N
1416	\N	\N
7925	\N	\N
7408	\N	\N
9992	\N	\N
2124	\N	\N
1024	\N	\N
1060	\N	\N
7893	\N	\N
5008	\N	\N
4266	\N	\N
8889	\N	\N
9859	\N	\N
4728	\N	\N
8609	\N	\N
3178	\N	\N
3438	\N	\N
3605	\N	\N
8532	\N	\N
4462	\N	\N
4077	\N	\N
3188	\N	\N
7142	\N	\N
3812	\N	\N
6587	\N	\N
5686	\N	\N
1663	\N	\N
6231	\N	\N
6780	\N	\N
9253	\N	\N
9742	\N	\N
4314	\N	\N
7731	\N	\N
4742	\N	\N
9692	\N	\N
4915	\N	\N
7642	\N	\N
2988	\N	\N
3902	\N	\N
3586	\N	\N
7227	\N	\N
4937	\N	\N
2819	\N	\N
7769	\N	\N
1202	\N	\N
6645	\N	\N
2761	\N	\N
2330	\N	\N
2304	\N	\N
7779	\N	\N
2439	\N	\N
2119	\N	\N
6690	\N	\N
1546	\N	\N
3225	\N	\N
5896	\N	\N
8551	\N	\N
1686	\N	\N
4893	\N	\N
4325	\N	\N
3244	\N	\N
3991	\N	\N
2191	\N	\N
8539	\N	\N
4401	\N	\N
8818	\N	\N
5748	\N	\N
9791	\N	\N
9172	\N	\N
7293	\N	\N
7143	\N	\N
2268	\N	\N
7802	\N	\N
8792	\N	\N
6083	\N	\N
2170	\N	\N
1757	\N	\N
2996	\N	\N
2726	\N	\N
6648	\N	\N
1943	\N	\N
1104	\N	\N
1098	\N	\N
9520	\N	\N
5488	\N	\N
1783	\N	\N
6702	\N	\N
7366	\N	\N
8797	\N	\N
2301	\N	\N
5173	\N	\N
5862	\N	\N
2438	\N	\N
1679	\N	\N
8905	\N	\N
1669	\N	\N
6523	\N	\N
9453	\N	\N
1838	\N	\N
2547	\N	\N
1570	\N	\N
2522	\N	\N
8325	\N	\N
7325	\N	\N
2096	\N	\N
5546	\N	\N
7662	\N	\N
2245	\N	\N
6770	\N	\N
5669	\N	\N
8517	\N	\N
1492	\N	\N
5020	\N	\N
4341	\N	\N
5305	\N	\N
7545	\N	\N
5970	\N	\N
7674	\N	\N
8453	\N	\N
8112	\N	\N
5308	\N	\N
2509	\N	\N
4065	\N	\N
8826	\N	\N
6658	\N	\N
6433	\N	\N
9251	\N	\N
9472	\N	\N
9134	\N	\N
8319	\N	\N
2595	\N	\N
8567	\N	\N
8403	\N	\N
3529	\N	\N
6028	\N	\N
9644	\N	\N
8272	\N	\N
5520	\N	\N
5106	\N	\N
2921	\N	\N
2139	\N	\N
5826	\N	\N
5270	\N	\N
5538	\N	\N
3067	\N	\N
3543	\N	\N
5790	\N	\N
7278	\N	\N
7024	\N	\N
9562	\N	\N
9346	\N	\N
6309	\N	\N
9269	\N	\N
3589	\N	\N
6280	\N	\N
4008	\N	\N
9568	\N	\N
8287	\N	\N
1772	\N	\N
1857	\N	\N
5404	\N	\N
8575	\N	\N
3571	\N	\N
3644	\N	\N
2007	\N	\N
1614	\N	\N
5410	\N	\N
5216	\N	\N
1848	\N	\N
9503	\N	\N
6646	\N	\N
4444	\N	\N
9271	\N	\N
6986	\N	\N
1417	\N	\N
6045	\N	\N
1266	\N	\N
8118	\N	\N
5914	\N	\N
4353	\N	\N
8687	\N	\N
3209	\N	\N
5693	\N	\N
1874	\N	\N
7650	\N	\N
8103	\N	\N
7403	\N	\N
7158	\N	\N
3901	\N	\N
6899	\N	\N
1583	\N	\N
5342	\N	\N
6434	\N	\N
3968	\N	\N
5674	\N	\N
7974	\N	\N
7848	\N	\N
7438	\N	\N
8004	\N	\N
6184	\N	\N
5363	\N	\N
3709	\N	\N
4294	\N	\N
1889	\N	\N
7389	\N	\N
3951	\N	\N
5495	\N	\N
6465	\N	\N
9280	\N	\N
1147	\N	\N
8269	\N	\N
8425	\N	\N
6932	\N	\N
8716	\N	\N
4666	\N	\N
8469	\N	\N
6863	\N	\N
3397	\N	\N
2471	\N	\N
4348	\N	\N
2764	\N	\N
4189	\N	\N
1495	\N	\N
1192	\N	\N
9682	\N	\N
5416	\N	\N
5701	\N	\N
4407	\N	\N
4862	\N	\N
7934	\N	\N
2502	\N	\N
7341	\N	\N
1911	\N	\N
8762	\N	\N
8273	\N	\N
2914	\N	\N
1310	\N	\N
4107	\N	\N
9818	\N	\N
1935	\N	\N
3522	\N	\N
1938	\N	\N
9184	\N	\N
1919	\N	\N
9779	\N	\N
3429	\N	\N
9068	\N	\N
8769	\N	\N
4409	\N	\N
4763	\N	\N
6125	\N	\N
4546	\N	\N
5151	\N	\N
2241	\N	\N
5242	\N	\N
1125	\N	\N
2327	\N	\N
8410	\N	\N
7524	\N	\N
8448	\N	\N
9800	\N	\N
6389	\N	\N
1009	\N	\N
2997	\N	\N
6273	\N	\N
2406	\N	\N
4884	\N	\N
6478	\N	\N
9087	\N	\N
8996	\N	\N
3385	\N	\N
3758	\N	\N
2985	\N	\N
3929	\N	\N
6043	\N	\N
5053	\N	\N
7921	\N	\N
8686	\N	\N
5064	\N	\N
1184	\N	\N
4011	\N	\N
6621	\N	\N
3054	\N	\N
5724	\N	\N
1559	\N	\N
4765	\N	\N
6506	\N	\N
5231	\N	\N
9612	\N	\N
6810	\N	\N
3815	\N	\N
2427	\N	\N
6698	\N	\N
6946	\N	\N
4480	\N	\N
6762	\N	\N
4916	\N	\N
5813	\N	\N
6154	\N	\N
4958	\N	\N
2293	\N	\N
7879	\N	\N
8126	\N	\N
7655	\N	\N
8378	\N	\N
3975	\N	\N
3359	\N	\N
4652	\N	\N
2150	\N	\N
4481	\N	\N
6786	\N	\N
5142	\N	\N
6511	\N	\N
1643	\N	\N
5619	\N	\N
4402	\N	\N
7872	\N	\N
3531	\N	\N
6558	\N	\N
6040	\N	\N
6830	\N	\N
5359	\N	\N
2564	\N	\N
8254	\N	\N
5503	\N	\N
9954	\N	\N
4897	\N	\N
7775	\N	\N
1284	\N	\N
4061	\N	\N
7959	\N	\N
8398	\N	\N
2372	\N	\N
9075	\N	\N
5212	\N	\N
3623	\N	\N
5414	\N	\N
3333	\N	\N
7527	\N	\N
5870	\N	\N
6461	\N	\N
2739	\N	\N
5524	\N	\N
9905	\N	\N
5311	\N	\N
9422	\N	\N
5875	\N	\N
2228	\N	\N
5537	\N	\N
6915	\N	\N
5452	\N	\N
7038	\N	\N
8107	\N	\N
5992	\N	\N
9459	\N	\N
9639	\N	\N
3558	\N	\N
1502	\N	\N
5069	\N	\N
2114	\N	\N
6573	\N	\N
7622	\N	\N
2763	\N	\N
8788	\N	\N
2694	\N	\N
3634	\N	\N
4412	\N	\N
3972	\N	\N
4067	\N	\N
4118	\N	\N
9192	\N	\N
2958	\N	\N
8742	\N	\N
4680	\N	\N
5084	\N	\N
1572	\N	\N
7446	\N	\N
5448	\N	\N
2261	\N	\N
1641	\N	\N
9418	\N	\N
4452	\N	\N
9258	\N	\N
9971	\N	\N
9735	\N	\N
5282	\N	\N
1360	\N	\N
2332	\N	\N
3096	\N	\N
1340	\N	\N
1274	\N	\N
2664	\N	\N
6220	\N	\N
6322	\N	\N
8565	\N	\N
5981	\N	\N
2993	\N	\N
9816	\N	\N
7700	\N	\N
8651	\N	\N
7122	\N	\N
8772	\N	\N
1670	\N	\N
8236	\N	\N
4027	\N	\N
4006	\N	\N
5842	\N	\N
9263	\N	\N
9223	\N	\N
9655	\N	\N
6553	\N	\N
2838	\N	\N
5400	\N	\N
7584	\N	\N
9616	\N	\N
7398	\N	\N
7654	\N	\N
6074	\N	\N
3185	\N	\N
8322	\N	\N
2798	\N	\N
8658	\N	\N
7035	\N	\N
7049	\N	\N
2398	\N	\N
7993	\N	\N
2631	\N	\N
3224	\N	\N
2676	\N	\N
6333	\N	\N
3133	\N	\N
5099	\N	\N
9190	\N	\N
4604	\N	\N
1488	\N	\N
1672	\N	\N
5274	\N	\N
7546	\N	\N
1367	\N	\N
1403	\N	\N
7817	\N	\N
9745	\N	\N
8199	\N	\N
3756	\N	\N
6299	\N	\N
2833	\N	\N
4213	\N	\N
7828	\N	\N
6431	\N	\N
7450	\N	\N
1543	\N	\N
8952	\N	\N
6678	\N	\N
3382	\N	\N
7118	\N	\N
3434	\N	\N
7629	\N	\N
7396	\N	\N
7894	\N	\N
4749	\N	\N
7535	\N	\N
8921	\N	\N
4005	\N	\N
6602	\N	\N
9681	\N	\N
2022	\N	\N
2979	\N	\N
3939	\N	\N
8259	\N	\N
8304	\N	\N
6520	\N	\N
1980	\N	\N
3439	\N	\N
8796	\N	\N
8288	\N	\N
3870	\N	\N
6765	\N	\N
6850	\N	\N
5487	\N	\N
4442	\N	\N
8831	\N	\N
4416	\N	\N
6623	\N	\N
2126	\N	\N
7378	\N	\N
6486	\N	\N
1709	\N	\N
4049	\N	\N
7201	\N	\N
8348	\N	\N
4041	\N	\N
3594	\N	\N
7444	\N	\N
8311	\N	\N
9364	\N	\N
1808	\N	\N
9527	\N	\N
5086	\N	\N
1101	\N	\N
6753	\N	\N
1472	\N	\N
3923	\N	\N
6018	\N	\N
7274	\N	\N
2975	\N	\N
8582	\N	\N
2758	\N	\N
1389	\N	\N
7825	\N	\N
7972	\N	\N
1272	\N	\N
7058	\N	\N
3636	\N	\N
4861	\N	\N
1061	\N	\N
5988	\N	\N
4433	\N	\N
3850	\N	\N
5015	\N	\N
2839	\N	\N
1644	\N	\N
3055	\N	\N
7645	\N	\N
9598	\N	\N
5376	\N	\N
2488	\N	\N
2853	\N	\N
7539	\N	\N
4664	\N	\N
2122	\N	\N
6148	\N	\N
3822	\N	\N
4855	\N	\N
9899	\N	\N
8841	\N	\N
1209	\N	\N
1828	\N	\N
5876	\N	\N
1300	\N	\N
1319	\N	\N
2566	\N	\N
4973	\N	\N
4467	\N	\N
8284	\N	\N
2892	\N	\N
6853	\N	\N
1965	\N	\N
5897	\N	\N
6099	\N	\N
7804	\N	\N
7331	\N	\N
9810	\N	\N
4545	\N	\N
3769	\N	\N
8907	\N	\N
1721	\N	\N
6479	\N	\N
9488	\N	\N
5611	\N	\N
1476	\N	\N
1985	\N	\N
7339	\N	\N
8806	\N	\N
6638	\N	\N
2443	\N	\N
1251	\N	\N
9707	\N	\N
4531	\N	\N
4859	\N	\N
7251	\N	\N
3247	\N	\N
8421	\N	\N
3399	\N	\N
3462	\N	\N
4551	\N	\N
5987	\N	\N
6341	\N	\N
5014	\N	\N
9819	\N	\N
9355	\N	\N
4321	\N	\N
5590	\N	\N
5678	\N	\N
5844	\N	\N
3261	\N	\N
4870	\N	\N
3218	\N	\N
4235	\N	\N
4099	\N	\N
6375	\N	\N
8555	\N	\N
1533	\N	\N
7263	\N	\N
6259	\N	\N
3478	\N	\N
5917	\N	\N
3615	\N	\N
2447	\N	\N
4004	\N	\N
3479	\N	\N
3196	\N	\N
5331	\N	\N
2210	\N	\N
1178	\N	\N
3146	\N	\N
2782	\N	\N
6485	\N	\N
3063	\N	\N
8380	\N	\N
9725	\N	\N
3463	\N	\N
1017	\N	\N
5057	\N	\N
4146	\N	\N
1362	\N	\N
2137	\N	\N
6185	\N	\N
5279	\N	\N
5682	\N	\N
2294	\N	\N
2551	\N	\N
9508	\N	\N
5933	\N	\N
4792	\N	\N
2288	\N	\N
1564	\N	\N
7749	\N	\N
1440	\N	\N
2527	\N	\N
2348	\N	\N
4853	\N	\N
9729	\N	\N
3832	\N	\N
6203	\N	\N
6578	\N	\N
1002	\N	\N
3330	\N	\N
5236	\N	\N
4502	\N	\N
1402	\N	\N
2019	\N	\N
1571	\N	\N
7744	\N	\N
2143	\N	\N
1680	\N	\N
4988	\N	\N
2994	\N	\N
4269	\N	\N
4781	\N	\N
9303	\N	\N
2394	\N	\N
9863	\N	\N
8091	\N	\N
3357	\N	\N
2328	\N	\N
5646	\N	\N
4298	\N	\N
2481	\N	\N
9723	\N	\N
1117	\N	\N
9056	\N	\N
8908	\N	\N
8864	\N	\N
6217	\N	\N
4473	\N	\N
7243	\N	\N
2273	\N	\N
3474	\N	\N
1611	\N	\N
3608	\N	\N
4090	\N	\N
2032	\N	\N
8809	\N	\N
2647	\N	\N
6771	\N	\N
8062	\N	\N
1449	\N	\N
6718	\N	\N
2948	\N	\N
7352	\N	\N
8918	\N	\N
3523	\N	\N
9824	\N	\N
9150	\N	\N
7581	\N	\N
7419	\N	\N
8884	\N	\N
7413	\N	\N
1587	\N	\N
9698	\N	\N
2249	\N	\N
9649	\N	\N
2581	\N	\N
3834	\N	\N
1186	\N	\N
6092	\N	\N
8518	\N	\N
6004	\N	\N
7458	\N	\N
5412	\N	\N
2604	\N	\N
2858	\N	\N
9004	\N	\N
5250	\N	\N
6590	\N	\N
2854	\N	\N
6819	\N	\N
3511	\N	\N
2299	\N	\N
5356	\N	\N
4075	\N	\N
3876	\N	\N
4679	\N	\N
7886	\N	\N
4700	\N	\N
6205	\N	\N
8237	\N	\N
7189	\N	\N
1158	\N	\N
3817	\N	\N
8595	\N	\N
3117	\N	\N
3075	\N	\N
6609	\N	\N
8183	\N	\N
4063	\N	\N
9935	\N	\N
7680	\N	\N
8480	\N	\N
2259	\N	\N
5176	\N	\N
3973	\N	\N
9028	\N	\N
5140	\N	\N
4947	\N	\N
9027	\N	\N
9202	\N	\N
9573	\N	\N
9368	\N	\N
2545	\N	\N
2253	\N	\N
4984	\N	\N
2254	\N	\N
4464	\N	\N
8637	\N	\N
5519	\N	\N
2521	\N	\N
5846	\N	\N
3180	\N	\N
3226	\N	\N
6427	\N	\N
4618	\N	\N
8276	\N	\N
1291	\N	\N
9593	\N	\N
7939	\N	\N
6975	\N	\N
3502	\N	\N
7986	\N	\N
1197	\N	\N
1720	\N	\N
8202	\N	\N
3910	\N	\N
5881	\N	\N
9406	\N	\N
6071	\N	\N
6509	\N	\N
2242	\N	\N
5349	\N	\N
6905	\N	\N
2989	\N	\N
3189	\N	\N
3826	\N	\N
8331	\N	\N
7829	\N	\N
8522	\N	\N
8247	\N	\N
2319	\N	\N
9896	\N	\N
3223	\N	\N
8132	\N	\N
9790	\N	\N
4014	\N	\N
1216	\N	\N
2193	\N	\N
9395	\N	\N
6606	\N	\N
9029	\N	\N
7597	\N	\N
2202	\N	\N
4417	\N	\N
7397	\N	\N
2759	\N	\N
2540	\N	\N
8077	\N	\N
3306	\N	\N
5812	\N	\N
3710	\N	\N
7863	\N	\N
8206	\N	\N
2071	\N	\N
7797	\N	\N
1187	\N	\N
8294	\N	\N
6715	\N	\N
7565	\N	\N
9487	\N	\N
1826	\N	\N
9875	\N	\N
9910	\N	\N
2963	\N	\N
7467	\N	\N
4905	\N	\N
9123	\N	\N
8177	\N	\N
4259	\N	\N
2796	\N	\N
2208	\N	\N
2720	\N	\N
3734	\N	\N
1851	\N	\N
5513	\N	\N
8950	\N	\N
6096	\N	\N
1433	\N	\N
2550	\N	\N
4647	\N	\N
4427	\N	\N
7131	\N	\N
5880	\N	\N
1395	\N	\N
3161	\N	\N
4257	\N	\N
4808	\N	\N
6760	\N	\N
8366	\N	\N
6532	\N	\N
8431	\N	\N
8257	\N	\N
2897	\N	\N
1749	\N	\N
8872	\N	\N
9591	\N	\N
1196	\N	\N
5824	\N	\N
9913	\N	\N
2974	\N	\N
8218	\N	\N
2919	\N	\N
6470	\N	\N
1664	\N	\N
8026	\N	\N
5185	\N	\N
8729	\N	\N
2415	\N	\N
3289	\N	\N
2927	\N	\N
2967	\N	\N
5924	\N	\N
2635	\N	\N
1509	\N	\N
5175	\N	\N
3912	\N	\N
2777	\N	\N
8869	\N	\N
7414	\N	\N
6082	\N	\N
1354	\N	\N
1049	\N	\N
3449	\N	\N
4643	\N	\N
2543	\N	\N
5637	\N	\N
6212	\N	\N
3213	\N	\N
1743	\N	\N
1934	\N	\N
1485	\N	\N
5606	\N	\N
6182	\N	\N
7607	\N	\N
7594	\N	\N
5163	\N	\N
6105	\N	\N
3052	\N	\N
2033	\N	\N
3791	\N	\N
4332	\N	\N
2246	\N	\N
7653	\N	\N
7155	\N	\N
2740	\N	\N
5156	\N	\N
4871	\N	\N
4110	\N	\N
2374	\N	\N
6232	\N	\N
7815	\N	\N
4178	\N	\N
1179	\N	\N
5059	\N	\N
6759	\N	\N
8725	\N	\N
1667	\N	\N
1841	\N	\N
1276	\N	\N
3313	\N	\N
7164	\N	\N
9507	\N	\N
1931	\N	\N
7314	\N	\N
7307	\N	\N
6976	\N	\N
9975	\N	\N
7265	\N	\N
2903	\N	\N
7498	\N	\N
8172	\N	\N
8046	\N	\N
2503	\N	\N
3097	\N	\N
6557	\N	\N
4068	\N	\N
7068	\N	\N
5763	\N	\N
2673	\N	\N
5464	\N	\N
7145	\N	\N
7063	\N	\N
5974	\N	\N
4920	\N	\N
1844	\N	\N
1886	\N	\N
2515	\N	\N
2873	\N	\N
6877	\N	\N
8970	\N	\N
2309	\N	\N
2935	\N	\N
3058	\N	\N
7876	\N	\N
3892	\N	\N
9371	\N	\N
1166	\N	\N
4370	\N	\N
5660	\N	\N
1115	\N	\N
6784	\N	\N
7032	\N	\N
5867	\N	\N
3027	\N	\N
5085	\N	\N
1023	\N	\N
6504	\N	\N
9757	\N	\N
1400	\N	\N
5838	\N	\N
1452	\N	\N
2095	\N	\N
8455	\N	\N
6601	\N	\N
6761	\N	\N
5865	\N	\N
5371	\N	\N
8250	\N	\N
9623	\N	\N
9951	\N	\N
4342	\N	\N
4766	\N	\N
6924	\N	\N
7701	\N	\N
1057	\N	\N
6060	\N	\N
9115	\N	\N
3738	\N	\N
6100	\N	\N
4617	\N	\N
7740	\N	\N
7586	\N	\N
3532	\N	\N
9358	\N	\N
3592	\N	\N
9720	\N	\N
6462	\N	\N
6937	\N	\N
6847	\N	\N
8030	\N	\N
2896	\N	\N
6530	\N	\N
5481	\N	\N
7809	\N	\N
2248	\N	\N
9912	\N	\N
8861	\N	\N
9301	\N	\N
8936	\N	\N
5447	\N	\N
4668	\N	\N
5040	\N	\N
9187	\N	\N
8341	\N	\N
3730	\N	\N
5413	\N	\N
3443	\N	\N
6845	\N	\N
8578	\N	\N
8191	\N	\N
4048	\N	\N
3123	\N	\N
2569	\N	\N
5612	\N	\N
5860	\N	\N
3680	\N	\N
6155	\N	\N
9119	\N	\N
5979	\N	\N
6400	\N	\N
4794	\N	\N
5241	\N	\N
7149	\N	\N
5982	\N	\N
7994	\N	\N
3020	\N	\N
2817	\N	\N
3829	\N	\N
4594	\N	\N
5214	\N	\N
4557	\N	\N
1610	\N	\N
8270	\N	\N
1278	\N	\N
6166	\N	\N
3282	\N	\N
6090	\N	\N
7806	\N	\N
7652	\N	\N
3600	\N	\N
8064	\N	\N
3684	\N	\N
8466	\N	\N
4140	\N	\N
3374	\N	\N
7826	\N	\N
6236	\N	\N
8146	\N	\N
6564	\N	\N
9861	\N	\N
8840	\N	\N
5717	\N	\N
9492	\N	\N
4483	\N	\N
3694	\N	\N
3646	\N	\N
6823	\N	\N
7415	\N	\N
1022	\N	\N
4735	\N	\N
6856	\N	\N
2518	\N	\N
5521	\N	\N
7479	\N	\N
1688	\N	\N
2830	\N	\N
6119	\N	\N
1638	\N	\N
1662	\N	\N
5178	\N	\N
7600	\N	\N
2945	\N	\N
9959	\N	\N
9293	\N	\N
2703	\N	\N
5720	\N	\N
1451	\N	\N
4509	\N	\N
4297	\N	\N
2423	\N	\N
3771	\N	\N
9215	\N	\N
1118	\N	\N
2602	\N	\N
7082	\N	\N
7069	\N	\N
1483	\N	\N
8140	\N	\N
4319	\N	\N
3686	\N	\N
4754	\N	\N
1111	\N	\N
2237	\N	\N
1469	\N	\N
6473	\N	\N
8750	\N	\N
4121	\N	\N
9662	\N	\N
7512	\N	\N
8930	\N	\N
3524	\N	\N
4173	\N	\N
1070	\N	\N
5327	\N	\N
7015	\N	\N
4151	\N	\N
2788	\N	\N
8563	\N	\N
5760	\N	\N
6535	\N	\N
1591	\N	\N
7328	\N	\N
9052	\N	\N
1887	\N	\N
8648	\N	\N
7022	\N	\N
2346	\N	\N
3125	\N	\N
8944	\N	\N
3148	\N	\N
8497	\N	\N
3267	\N	\N
3801	\N	\N
2743	\N	\N
9833	\N	\N
3436	\N	\N
2674	\N	\N
1203	\N	\N
6292	\N	\N
7095	\N	\N
7252	\N	\N
6746	\N	\N
6343	\N	\N
4844	\N	\N
3324	\N	\N
7803	\N	\N
3880	\N	\N
2008	\N	\N
3940	\N	\N
7632	\N	\N
2045	\N	\N
7223	\N	\N
1260	\N	\N
9481	\N	\N
8947	\N	\N
6974	\N	\N
8886	\N	\N
5562	\N	\N
8440	\N	\N
9960	\N	\N
5579	\N	\N
8413	\N	\N
8364	\N	\N
4873	\N	\N
3393	\N	\N
6874	\N	\N
3255	\N	\N
4939	\N	\N
4981	\N	\N
3269	\N	\N
9020	\N	\N
9789	\N	\N
7202	\N	\N
2715	\N	\N
1738	\N	\N
6611	\N	\N
6059	\N	\N
8782	\N	\N
8508	\N	\N
1883	\N	\N
2421	\N	\N
8708	\N	\N
8429	\N	\N
9536	\N	\N
5690	\N	\N
5459	\N	\N
7321	\N	\N
9054	\N	\N
8577	\N	\N
9008	\N	\N
8657	\N	\N
7300	\N	\N
3620	\N	\N
2794	\N	\N
1358	\N	\N
4134	\N	\N
5110	\N	\N
8740	\N	\N
4152	\N	\N
5091	\N	\N
1148	\N	\N
2350	\N	\N
7405	\N	\N
6513	\N	\N
1456	\N	\N
9637	\N	\N
6603	\N	\N
4394	\N	\N
9963	\N	\N
7599	\N	\N
1740	\N	\N
9018	\N	\N
8808	\N	\N
6933	\N	\N
3061	\N	\N
8767	\N	\N
4913	\N	\N
9281	\N	\N
5762	\N	\N
8056	\N	\N
5233	\N	\N
2078	\N	\N
7542	\N	\N
5983	\N	\N
6326	\N	\N
3256	\N	\N
5165	\N	\N
3659	\N	\N
9903	\N	\N
6581	\N	\N
2127	\N	\N
9854	\N	\N
3210	\N	\N
9254	\N	\N
2485	\N	\N
8454	\N	\N
7846	\N	\N
3076	\N	\N
5010	\N	\N
4058	\N	\N
8754	\N	\N
7138	\N	\N
7666	\N	\N
6491	\N	\N
9578	\N	\N
3909	\N	\N
3205	\N	\N
5090	\N	\N
8443	\N	\N
4449	\N	\N
3412	\N	\N
2371	\N	\N
8640	\N	\N
3736	\N	\N
9262	\N	\N
4471	\N	\N
6995	\N	\N
9773	\N	\N
6888	\N	\N
4772	\N	\N
4823	\N	\N
2418	\N	\N
4507	\N	\N
7520	\N	\N
9238	\N	\N
1538	\N	\N
3954	\N	\N
5167	\N	\N
6804	\N	\N
3672	\N	\N
4504	\N	\N
9703	\N	\N
4959	\N	\N
6939	\N	\N
5809	\N	\N
9169	\N	\N
5711	\N	\N
8402	\N	\N
4214	\N	\N
8151	\N	\N
5079	\N	\N
9558	\N	\N
4774	\N	\N
8124	\N	\N
3718	\N	\N
7221	\N	\N
9994	\N	\N
8933	\N	\N
3453	\N	\N
5608	\N	\N
7580	\N	\N
7760	\N	\N
1876	\N	\N
5742	\N	\N
1942	\N	\N
1549	\N	\N
3853	\N	\N
8783	\N	\N
6979	\N	\N
4009	\N	\N
3731	\N	\N
7040	\N	\N
3639	\N	\N
3517	\N	\N
5427	\N	\N
3866	\N	\N
5421	\N	\N
7620	\N	\N
9445	\N	\N
4555	\N	\N
3606	\N	\N
3603	\N	\N
6012	\N	\N
4630	\N	\N
2197	\N	\N
7784	\N	\N
4391	\N	\N
6448	\N	\N
3803	\N	\N
1734	\N	\N
3342	\N	\N
8243	\N	\N
4577	\N	\N
5351	\N	\N
2722	\N	\N
4423	\N	\N
9043	\N	\N
7200	\N	\N
4440	\N	\N
9077	\N	\N
8999	\N	\N
7868	\N	\N
3867	\N	\N
6731	\N	\N
7964	\N	\N
3596	\N	\N
4777	\N	\N
2314	\N	\N
6992	\N	\N
5171	\N	\N
4565	\N	\N
3013	\N	\N
8703	\N	\N
3132	\N	\N
1753	\N	\N
8239	\N	\N
1565	\N	\N
3377	\N	\N
7326	\N	\N
6424	\N	\N
6794	\N	\N
5127	\N	\N
4469	\N	\N
4553	\N	\N
8005	\N	\N
6990	\N	\N
2088	\N	\N
3035	\N	\N
5930	\N	\N
1234	\N	\N
6912	\N	\N
4316	\N	\N
6418	\N	\N
1044	\N	\N
5455	\N	\N
4003	\N	\N
8130	\N	\N
4438	\N	\N
8770	\N	\N
5243	\N	\N
4838	\N	\N
2736	\N	\N
4420	\N	\N
6038	\N	\N
8201	\N	\N
3887	\N	\N
2410	\N	\N
6468	\N	\N
6662	\N	\N
9830	\N	\N
3347	\N	\N
5132	\N	\N
5065	\N	\N
1514	\N	\N
9318	\N	\N
5049	\N	\N
9727	\N	\N
1823	\N	\N
2104	\N	\N
8148	\N	\N
3772	\N	\N
4221	\N	\N
7037	\N	\N
6667	\N	\N
1785	\N	\N
7432	\N	\N
1477	\N	\N
5366	\N	\N
8860	\N	\N
9764	\N	\N
5201	\N	\N
9086	\N	\N
8473	\N	\N
4631	\N	\N
9441	\N	\N
1129	\N	\N
9217	\N	\N
2077	\N	\N
2496	\N	\N
8998	\N	\N
9679	\N	\N
9878	\N	\N
8681	\N	\N
4685	\N	\N
2361	\N	\N
5183	\N	\N
9780	\N	\N
6252	\N	\N
2966	\N	\N
9822	\N	\N
4549	\N	\N
1479	\N	\N
8360	\N	\N
1961	\N	\N
2864	\N	\N
8450	\N	\N
9533	\N	\N
7231	\N	\N
9638	\N	\N
9572	\N	\N
1394	\N	\N
9320	\N	\N
4526	\N	\N
3739	\N	\N
7373	\N	\N
6016	\N	\N
8883	\N	\N
9996	\N	\N
9660	\N	\N
8789	\N	\N
6521	\N	\N
8327	\N	\N
4837	\N	\N
3957	\N	\N
7843	\N	\N
6574	\N	\N
6265	\N	\N
4989	\N	\N
1087	\N	\N
7114	\N	\N
3693	\N	\N
4465	\N	\N
2131	\N	\N
1029	\N	\N
7504	\N	\N
3775	\N	\N
8891	\N	\N
3469	\N	\N
3950	\N	\N
6909	\N	\N
1297	\N	\N
5636	\N	\N
7554	\N	\N
4724	\N	\N
9458	\N	\N
1784	\N	\N
9582	\N	\N
6815	\N	\N
2167	\N	\N
2653	\N	\N
8647	\N	\N
3118	\N	\N
2704	\N	\N
3527	\N	\N
2051	\N	\N
8900	\N	\N
2290	\N	\N
1812	\N	\N
7547	\N	\N
8474	\N	\N
3963	\N	\N
2500	\N	\N
8300	\N	\N
2064	\N	\N
6047	\N	\N
6828	\N	\N
7530	\N	\N
5181	\N	\N
3295	\N	\N
9012	\N	\N
1846	\N	\N
1097	\N	\N
7363	\N	\N
3816	\N	\N
5403	\N	\N
8367	\N	\N
8821	\N	\N
5317	\N	\N
4610	\N	\N
7303	\N	\N
1675	\N	\N
3049	\N	\N
1172	\N	\N
9107	\N	\N
2377	\N	\N
4942	\N	\N
3356	\N	\N
2144	\N	\N
1231	\N	\N
7332	\N	\N
2618	\N	\N
9074	\N	\N
1865	\N	\N
5451	\N	\N
5052	\N	\N
8739	\N	\N
2408	\N	\N
7287	\N	\N
6734	\N	\N
1995	\N	\N
8181	\N	\N
8504	\N	\N
1503	\N	\N
9133	\N	\N
8688	\N	\N
9530	\N	\N
2755	\N	\N
2652	\N	\N
4018	\N	\N
3505	\N	\N
5424	\N	\N
6347	\N	\N
8275	\N	\N
4451	\N	\N
3896	\N	\N
2696	\N	\N
9067	\N	\N
7440	\N	\N
8386	\N	\N
1470	\N	\N
6871	\N	\N
4626	\N	\N
5292	\N	\N
9857	\N	\N
3612	\N	\N
3871	\N	\N
9901	\N	\N
9647	\N	\N
6875	\N	\N
8291	\N	\N
5023	\N	\N
8937	\N	\N
5189	\N	\N
2774	\N	\N
8941	\N	\N
2090	\N	\N
6709	\N	\N
3905	\N	\N
5195	\N	\N
6295	\N	\N
6985	\N	\N
6714	\N	\N
4344	\N	\N
7459	\N	\N
4709	\N	\N
6807	\N	\N
7317	\N	\N
3169	\N	\N
2626	\N	\N
4415	\N	\N
4184	\N	\N
5959	\N	\N
7783	\N	\N
2889	\N	\N
5071	\N	\N
2610	\N	\N
2457	\N	\N
6851	\N	\N
3565	\N	\N
1807	\N	\N
5708	\N	\N
7780	\N	\N
2379	\N	\N
1144	\N	\N
3232	\N	\N
8906	\N	\N
4070	\N	\N
5805	\N	\N
1446	\N	\N
8564	\N	\N
4748	\N	\N
7606	\N	\N
3999	\N	\N
3250	\N	\N
4755	\N	\N
4089	\N	\N
4923	\N	\N
3038	\N	\N
2805	\N	\N
3028	\N	\N
9977	\N	\N
1683	\N	\N
6943	\N	\N
5226	\N	\N
8928	\N	\N
1747	\N	\N
6647	\N	\N
6444	\N	\N
5441	\N	\N
4196	\N	\N
4731	\N	\N
4734	\N	\N
5618	\N	\N
1762	\N	\N
8356	\N	\N
1160	\N	\N
3563	\N	\N
4949	\N	\N
1112	\N	\N
1413	\N	\N
5733	\N	\N
4489	\N	\N
5439	\N	\N
1109	\N	\N
5168	\N	\N
1244	\N	\N
9117	\N	\N
9794	\N	\N
9621	\N	\N
7144	\N	\N
7460	\N	\N
3928	\N	\N
8507	\N	\N
6052	\N	\N
6048	\N	\N
7638	\N	\N
3579	\N	\N
8601	\N	\N
8785	\N	\N
9706	\N	\N
4340	\N	\N
3088	\N	\N
8075	\N	\N
2757	\N	\N
1322	\N	\N
6818	\N	\N
8678	\N	\N
4376	\N	\N
6266	\N	\N
6539	\N	\N
3705	\N	\N
2658	\N	\N
7785	\N	\N
3344	\N	\N
6796	\N	\N
4801	\N	\N
1392	\N	\N
5180	\N	\N
6064	\N	\N
2995	\N	\N
6825	\N	\N
9372	\N	\N
2342	\N	\N
1405	\N	\N
7026	\N	\N
8384	\N	\N
6149	\N	\N
8728	\N	\N
1974	\N	\N
8984	\N	\N
9862	\N	\N
7495	\N	\N
4193	\N	\N
3233	\N	\N
6110	\N	\N
1264	\N	\N
6202	\N	\N
8278	\N	\N
2898	\N	\N
2059	\N	\N
2875	\N	\N
5578	\N	\N
3530	\N	\N
6665	\N	\N
6957	\N	\N
1458	\N	\N
3933	\N	\N
7488	\N	\N
9176	\N	\N
4931	\N	\N
6743	\N	\N
3392	\N	\N
3604	\N	\N
4793	\N	\N
1435	\N	\N
6361	\N	\N
6157	\N	\N
3262	\N	\N
5746	\N	\N
2596	\N	\N
9769	\N	\N
2649	\N	\N
3484	\N	\N
4669	\N	\N
5063	\N	\N
6036	\N	\N
4486	\N	\N
3380	\N	\N
3281	\N	\N
2396	\N	\N
3768	\N	\N
3174	\N	\N
1837	\N	\N
7168	\N	\N
1967	\N	\N
4393	\N	\N
6973	\N	\N
7380	\N	\N
4676	\N	\N
9480	\N	\N
7595	\N	\N
7976	\N	\N
6669	\N	\N
2582	\N	\N
7441	\N	\N
6242	\N	\N
9678	\N	\N
1910	\N	\N
7715	\N	\N
7522	\N	\N
6297	\N	\N
9040	\N	\N
9865	\N	\N
4556	\N	\N
1347	\N	\N
8346	\N	\N
6738	\N	\N
5374	\N	\N
1235	\N	\N
4687	\N	\N
9131	\N	\N
1053	\N	\N
6555	\N	\N
3687	\N	\N
3476	\N	\N
8622	\N	\N
7055	\N	\N
3064	\N	\N
7360	\N	\N
2354	\N	\N
6661	\N	\N
6570	\N	\N
3974	\N	\N
8535	\N	\N
4999	\N	\N
5599	\N	\N
8409	\N	\N
1380	\N	\N
6270	\N	\N
7610	\N	\N
1013	\N	\N
6519	\N	\N
8045	\N	\N
7791	\N	\N
2760	\N	\N
1860	\N	\N
1448	\N	\N
4064	\N	\N
6114	\N	\N
3475	\N	\N
3119	\N	\N
5584	\N	\N
5346	\N	\N
7454	\N	\N
6445	\N	\N
4819	\N	\N
6960	\N	\N
7556	\N	\N
3647	\N	\N
9944	\N	\N
3317	\N	\N
6137	\N	\N
6452	\N	\N
4628	\N	\N
7099	\N	\N
2363	\N	\N
8156	\N	\N
3701	\N	\N
7858	\N	\N
1556	\N	\N
1371	\N	\N
5417	\N	\N
8343	\N	\N
8037	\N	\N
2063	\N	\N
3181	\N	\N
7091	\N	\N
6381	\N	\N
8994	\N	\N
3487	\N	\N
7409	\N	\N
5841	\N	\N
9091	\N	\N
6735	\N	\N
3931	\N	\N
3835	\N	\N
8277	\N	\N
6305	\N	\N
9221	\N	\N
1429	\N	\N
9345	\N	\N
5710	\N	\N
2052	\N	\N
1436	\N	\N
9614	\N	\N
6207	\N	\N
2498	\N	\N
6935	\N	\N
9676	\N	\N
9803	\N	\N
7065	\N	\N
4397	\N	\N
3555	\N	\N
5437	\N	\N
1275	\N	\N
9606	\N	\N
8357	\N	\N
8858	\N	\N
2623	\N	\N
1822	\N	\N
3106	\N	\N
4286	\N	\N
1853	\N	\N
5564	\N	\N
7464	\N	\N
4179	\N	\N
5200	\N	\N
2006	\N	\N
2154	\N	\N
4062	\N	\N
1998	\N	\N
7292	\N	\N
2116	\N	\N
2850	\N	\N
9457	\N	\N
8246	\N	\N
4727	\N	\N
9171	\N	\N
1789	\N	\N
1794	\N	\N
6256	\N	\N
4707	\N	\N
9001	\N	\N
7962	\N	\N
2334	\N	\N
1871	\N	\N
5307	\N	\N
9632	\N	\N
2297	\N	\N
3865	\N	\N
3873	\N	\N
4024	\N	\N
5449	\N	\N
9365	\N	\N
5855	\N	\N
6109	\N	\N
1042	\N	\N
7566	\N	\N
5886	\N	\N
2980	\N	\N
3395	\N	\N
7275	\N	\N
7500	\N	\N
1432	\N	\N
3946	\N	\N
6936	\N	\N
7338	\N	\N
8593	\N	\N
6005	\N	\N
4046	\N	\N
7568	\N	\N
4957	\N	\N
7896	\N	\N
8427	\N	\N
8263	\N	\N
4369	\N	\N
9719	\N	\N
1671	\N	\N
9270	\N	\N
4194	\N	\N
3935	\N	\N
6392	\N	\N
4832	\N	\N
1050	\N	\N
4771	\N	\N
9788	\N	\N
5571	\N	\N
3221	\N	\N
4047	\N	\N
1228	\N	\N
8411	\N	\N
5056	\N	\N
9469	\N	\N
1555	\N	\N
8264	\N	\N
9155	\N	\N
9375	\N	\N
7537	\N	\N
4566	\N	\N
1279	\N	\N
8290	\N	\N
8927	\N	\N
4688	\N	\N
4111	\N	\N
2384	\N	\N
6390	\N	\N
7877	\N	\N
5054	\N	\N
8776	\N	\N
5267	\N	\N
2843	\N	\N
2603	\N	\N
2353	\N	\N
6360	\N	\N
4869	\N	\N
8745	\N	\N
3327	\N	\N
6238	\N	\N
4816	\N	\N
1383	\N	\N
3757	\N	\N
3407	\N	\N
5767	\N	\N
8798	\N	\N
4224	\N	\N
1952	\N	\N
7426	\N	\N
3616	\N	\N
9628	\N	\N
6338	\N	\N
5435	\N	\N
2316	\N	\N
9209	\N	\N
5730	\N	\N
1660	\N	\N
9058	\N	\N
8149	\N	\N
6348	\N	\N
4623	\N	\N
6350	\N	\N
1259	\N	\N
1232	\N	\N
5893	\N	\N
3970	\N	\N
9754	\N	\N
2093	\N	\N
3083	\N	\N
6358	\N	\N
7471	\N	\N
2575	\N	\N
8306	\N	\N
1385	\N	\N
7346	\N	\N
4850	\N	\N
8850	\N	\N
9145	\N	\N
4522	\N	\N
8399	\N	\N
7596	\N	\N
2560	\N	\N
8690	\N	\N
6160	\N	\N
8136	\N	\N
1370	\N	\N
5320	\N	\N
2915	\N	\N
3427	\N	\N
7070	\N	\N
8209	\N	\N
4305	\N	\N
5535	\N	\N
9240	\N	\N
8320	\N	\N
1745	\N	\N
9509	\N	\N
4713	\N	\N
6708	\N	\N
5632	\N	\N
2437	\N	\N
1504	\N	\N
9461	\N	\N
2865	\N	\N
5559	\N	\N
9431	\N	\N
5515	\N	\N
8423	\N	\N
3095	\N	\N
7044	\N	\N
8946	\N	\N
2499	\N	\N
1795	\N	\N
2046	\N	\N
9384	\N	\N
1902	\N	\N
4055	\N	\N
2300	\N	\N
5698	\N	\N
8899	\N	\N
7473	\N	\N
8035	\N	\N
6398	\N	\N
9277	\N	\N
4258	\N	\N
3092	\N	\N
5740	\N	\N
6704	\N	\N
9307	\N	\N
7746	\N	\N
2754	\N	\N
3310	\N	\N
4180	\N	\N
9879	\N	\N
2991	\N	\N
4387	\N	\N
9200	\N	\N
3858	\N	\N
2609	\N	\N
6340	\N	\N
6475	\N	\N
9417	\N	\N
6161	\N	\N
7786	\N	\N
5390	\N	\N
8395	\N	\N
7603	\N	\N
1673	\N	\N
6054	\N	\N
1213	\N	\N
3391	\N	\N
8302	\N	\N
6717	\N	\N
2990	\N	\N
3998	\N	\N
7920	\N	\N
5615	\N	\N
8163	\N	\N
9363	\N	\N
3996	\N	\N
8771	\N	\N
5572	\N	\N
1623	\N	\N
1037	\N	\N
3740	\N	\N
5563	\N	\N
9519	\N	\N
2195	\N	\N
4361	\N	\N
8150	\N	\N
1829	\N	\N
6952	\N	\N
3401	\N	\N
1240	\N	\N
6226	\N	\N
9870	\N	\N
1165	\N	\N
7046	\N	\N
3666	\N	\N
8737	\N	\N
8557	\N	\N
1072	\N	\N
3099	\N	\N
6080	\N	\N
1079	\N	\N
1430	\N	\N
3176	\N	\N
7218	\N	\N
5033	\N	\N
4088	\N	\N
8241	\N	\N
3591	\N	\N
5950	\N	\N
3305	\N	\N
2426	\N	\N
8588	\N	\N
6472	\N	\N
8713	\N	\N
3980	\N	\N
3086	\N	\N
1045	\N	\N
7525	\N	\N
7658	\N	\N
3810	\N	\N
5301	\N	\N
5600	\N	\N
4978	\N	\N
8599	\N	\N
1176	\N	\N
5510	\N	\N
3308	\N	\N
1175	\N	\N
8203	\N	\N
2115	\N	\N
1628	\N	\N
9608	\N	\N
2454	\N	\N
3863	\N	\N
3158	\N	\N
8685	\N	\N
4148	\N	\N
4657	\N	\N
5119	\N	\N
7981	\N	\N
4592	\N	\N
5706	\N	\N
6069	\N	\N
7103	\N	\N
9557	\N	\N
1739	\N	\N
4952	\N	\N
6435	\N	\N
5162	\N	\N
9834	\N	\N
8330	\N	\N
3789	\N	\N
7159	\N	\N
4327	\N	\N
1873	\N	\N
3567	\N	\N
2209	\N	\N
5248	\N	\N
9770	\N	\N
1567	\N	\N
8314	\N	\N
5121	\N	\N
5500	\N	\N
6550	\N	\N
5038	\N	\N
6867	\N	\N
8422	\N	\N
5405	\N	\N
3166	\N	\N
9605	\N	\N
1460	\N	\N
7298	\N	\N
8949	\N	\N
6688	\N	\N
6944	\N	\N
2073	\N	\N
1066	\N	\N
9370	\N	\N
1496	\N	\N
7695	\N	\N
2906	\N	\N
9542	\N	\N
2747	\N	\N
4304	\N	\N
4910	\N	\N
7677	\N	\N
7716	\N	\N
4902	\N	\N
3677	\N	\N
1406	\N	\N
2804	\N	\N
3361	\N	\N
6948	\N	\N
8871	\N	\N
1645	\N	\N
2680	\N	\N
2785	\N	\N
1427	\N	\N
2284	\N	\N
2449	\N	\N
5266	\N	\N
8887	\N	\N
9313	\N	\N
1900	\N	\N
9432	\N	\N
8901	\N	\N
5664	\N	\N
9351	\N	\N
2239	\N	\N
6101	\N	\N
7240	\N	\N
9890	\N	\N
9748	\N	\N
2140	\N	\N
6208	\N	\N
1717	\N	\N
7163	\N	\N
5761	\N	\N
5539	\N	\N
4279	\N	\N
5334	\N	\N
3201	\N	\N
4681	\N	\N
6144	\N	\N
4016	\N	\N
5378	\N	\N
3506	\N	\N
8587	\N	\N
2308	\N	\N
9239	\N	\N
2556	\N	\N
2230	\N	\N
3679	\N	\N
8310	\N	\N
8100	\N	\N
2894	\N	\N
4028	\N	\N
4450	\N	\N
1550	\N	\N
2709	\N	\N
4926	\N	\N
8527	\N	\N
9098	\N	\N
3191	\N	\N
9476	\N	\N
7123	\N	\N
8837	\N	\N
5652	\N	\N
5610	\N	\N
5391	\N	\N
8786	\N	\N
8694	\N	\N
7831	\N	\N
6566	\N	\N
2537	\N	\N
4597	\N	\N
1525	\N	\N
5775	\N	\N
7361	\N	\N
8164	\N	\N
5577	\N	\N
2730	\N	\N
1698	\N	\N
6707	\N	\N
7072	\N	\N
4033	\N	\N
8843	\N	\N
7345	\N	\N
1207	\N	\N
8071	\N	\N
5773	\N	\N
6321	\N	\N
8926	\N	\N
5355	\N	\N
7590	\N	\N
4236	\N	\N
7051	\N	\N
6778	\N	\N
8810	\N	\N
6561	\N	\N
3643	\N	\N
8258	\N	\N
4720	\N	\N
2584	\N	\N
1917	\N	\N
3534	\N	\N
3490	\N	\N
8863	\N	\N
7728	\N	\N
4799	\N	\N
4712	\N	\N
7399	\N	\N
8775	\N	\N
4605	\N	\N
2986	\N	\N
4017	\N	\N
3353	\N	\N
7907	\N	\N
7425	\N	\N
7891	\N	\N
3408	\N	\N
2977	\N	\N
6526	\N	\N
6838	\N	\N
5408	\N	\N
8031	\N	\N
8676	\N	\N
4936	\N	\N
9282	\N	\N
4436	\N	\N
2960	\N	\N
3539	\N	\N
2483	\N	\N
7999	\N	\N
9103	\N	\N
2707	\N	\N
7281	\N	\N
4514	\N	\N
9823	\N	\N
3211	\N	\N
9693	\N	\N
5873	\N	\N
1568	\N	\N
9718	\N	\N
2685	\N	\N
5649	\N	\N
2553	\N	\N
5244	\N	\N
9989	\N	\N
1361	\N	\N
8489	\N	\N
1969	\N	\N
9116	\N	\N
8800	\N	\N
2043	\N	\N
4658	\N	\N
3895	\N	\N
7212	\N	\N
7183	\N	\N
5964	\N	\N
8971	\N	\N
9436	\N	\N
1971	\N	\N
4972	\N	\N
8912	\N	\N
8347	\N	\N
8620	\N	\N
9165	\N	\N
4310	\N	\N
3089	\N	\N
8768	\N	\N
9551	\N	\N
6062	\N	\N
1687	\N	\N
6357	\N	\N
7112	\N	\N
8923	\N	\N
2557	\N	\N
6799	\N	\N
8401	\N	\N
4156	\N	\N
7676	\N	\N
2863	\N	\N
9162	\N	\N
8528	\N	\N
6808	\N	\N
5946	\N	\N
3057	\N	\N
1750	\N	\N
8053	\N	\N
7469	\N	\N
9825	\N	\N
5260	\N	\N
4354	\N	\N
7973	\N	\N
9309	\N	\N
6508	\N	\N
6216	\N	\N
2313	\N	\N
4807	\N	\N
2982	\N	\N
8695	\N	\N
8159	\N	\N
5256	\N	\N
5892	\N	\N
9517	\N	\N
9199	\N	\N
5009	\N	\N
2924	\N	\N
8292	\N	\N
4251	\N	\N
3747	\N	\N
3886	\N	\N
9071	\N	\N
8081	\N	\N
1159	\N	\N
1607	\N	\N
3270	\N	\N
2387	\N	\N
7591	\N	\N
3277	\N	\N
6627	\N	\N
6516	\N	\N
5001	\N	\N
1888	\N	\N
1230	\N	\N
7111	\N	\N
5312	\N	\N
8475	\N	\N
5677	\N	\N
9191	\N	\N
1242	\N	\N
3875	\N	\N
9099	\N	\N
5549	\N	\N
8721	\N	\N
5039	\N	\N
5969	\N	\N
5958	\N	\N
8328	\N	\N
7151	\N	\N
3994	\N	\N
5972	\N	\N
6713	\N	\N
3572	\N	\N
8596	\N	\N
1311	\N	\N
2978	\N	\N
3458	\N	\N
5949	\N	\N
9588	\N	\N
1535	\N	\N
7866	\N	\N
1517	\N	\N
3335	\N	\N
3779	\N	\N
1604	\N	\N
3384	\N	\N
8227	\N	\N
9796	\N	\N
2448	\N	\N
8655	\N	\N
2797	\N	\N
3037	\N	\N
7821	\N	\N
7172	\N	\N
3989	\N	\N
1947	\N	\N
7412	\N	\N
9949	\N	\N
1839	\N	\N
3087	\N	\N
6835	\N	\N
6335	\N	\N
9883	\N	\N
3512	\N	\N
6576	\N	\N
8070	\N	\N
4252	\N	\N
1955	\N	\N
3149	\N	\N
2587	\N	\N
7844	\N	\N
4468	\N	\N
6332	\N	\N
9525	\N	\N
9219	\N	\N
7682	\N	\N
8924	\N	\N
7885	\N	\N
5704	\N	\N
3598	\N	\N
9234	\N	\N
8709	\N	\N
3481	\N	\N
3323	\N	\N
5047	\N	\N
2510	\N	\N
6077	\N	\N
6996	\N	\N
9969	\N	\N
3471	\N	\N
5474	\N	\N
6180	\N	\N
7997	\N	\N
3570	\N	\N
4829	\N	\N
8707	\N	\N
2565	\N	\N
7763	\N	\N
5389	\N	\N
3745	\N	\N
7772	\N	\N
2916	\N	\N
1046	\N	\N
1540	\N	\N
7190	\N	\N
3190	\N	\N
9571	\N	\N
5501	\N	\N
5879	\N	\N
9658	\N	\N
7084	\N	\N
5111	\N	\N
4399	\N	\N
4857	\N	\N
5525	\N	\N
9596	\N	\N
9784	\N	\N
6965	\N	\N
1991	\N	\N
3179	\N	\N
3141	\N	\N
1766	\N	\N
8002	\N	\N
2622	\N	\N
8334	\N	\N
2729	\N	\N
4432	\N	\N
1131	\N	\N
7767	\N	\N
7312	\N	\N
9034	\N	\N
3299	\N	\N
7956	\N	\N
4431	\N	\N
5507	\N	\N
6545	\N	\N
7177	\N	\N
5324	\N	\N
1391	\N	\N
5550	\N	\N
9032	\N	\N
7719	\N	\N
7734	\N	\N
2265	\N	\N
5170	\N	\N
5996	\N	\N
4710	\N	\N
7755	\N	\N
2149	\N	\N
7800	\N	\N
8230	\N	\N
4324	\N	\N
7726	\N	\N
2588	\N	\N
9041	\N	\N
2638	\N	\N
8870	\N	\N
1135	\N	\N
5811	\N	\N
5144	\N	\N
8985	\N	\N
7874	\N	\N
2882	\N	\N
8028	\N	\N
2577	\N	\N
3798	\N	\N
5552	\N	\N
9493	\N	\N
4587	\N	\N
2727	\N	\N
7839	\N	\N
4425	\N	\N
7192	\N	\N
8879	\N	\N
3856	\N	\N
2048	\N	\N
4825	\N	\N
2450	\N	\N
5638	\N	\N
3042	\N	\N
7693	\N	\N
9514	\N	\N
9730	\N	\N
7741	\N	\N
4228	\N	\N
2840	\N	\N
2862	\N	\N
8836	\N	\N
6571	\N	\N
4598	\N	\N
8021	\N	\N
5205	\N	\N
4619	\N	\N
1790	\N	\N
3351	\N	\N
8827	\N	\N
2723	\N	\N
6747	\N	\N
7085	\N	\N
8966	\N	\N
6824	\N	\N
8018	\N	\N
8548	\N	\N
3482	\N	\N
2656	\N	\N
7926	\N	\N
8639	\N	\N
2190	\N	\N
1562	\N	\N
6534	\N	\N
2831	\N	\N
7318	\N	\N
9966	\N	\N
5940	\N	\N
5910	\N	\N
7045	\N	\N
8312	\N	\N
4395	\N	\N
3259	\N	\N
1625	\N	\N
2192	\N	\N
3921	\N	\N
5839	\N	\N
5113	\N	\N
8192	\N	\N
4056	\N	\N
5022	\N	\N
7722	\N	\N
1606	\N	\N
4843	\N	\N
7859	\N	\N
7678	\N	\N
9840	\N	\N
7124	\N	\N
7747	\N	\N
4283	\N	\N
9112	\N	\N
6575	\N	\N
7670	\N	\N
6474	\N	\N
8092	\N	\N
3441	\N	\N
7457	\N	\N
4368	\N	\N
9708	\N	\N
2943	\N	\N
6057	\N	\N
7357	\N	\N
5129	\N	\N
1779	\N	\N
2869	\N	\N
4245	\N	\N
6792	\N	\N
4872	\N	\N
3137	\N	\N
3485	\N	\N
8749	\N	\N
6887	\N	\N
9374	\N	\N
3059	\N	\N
6562	\N	\N
4996	\N	\N
5951	\N	\N
2336	\N	\N
9151	\N	\N
9415	\N	\N
6093	\N	\N
2886	\N	\N
4092	\N	\N
6128	\N	\N
8644	\N	\N
8315	\N	\N
3762	\N	\N
6263	\N	\N
1163	\N	\N
7075	\N	\N
8015	\N	\N
2017	\N	\N
9290	\N	\N
9456	\N	\N
4609	\N	\N
3751	\N	\N
8205	\N	\N
9382	\N	\N
4960	\N	\N
1401	\N	\N
4706	\N	\N
8618	\N	\N
6884	\N	\N
1212	\N	\N
6147	\N	\N
7208	\N	\N
2428	\N	\N
3014	\N	\N
5941	\N	\N
8969	\N	\N
2083	\N	\N
2973	\N	\N
6455	\N	\N
1363	\N	\N
3496	\N	\N
8702	\N	\N
8479	\N	\N
1869	\N	\N
1596	\N	\N
1226	\N	\N
3053	\N	\N
9749	\N	\N
2705	\N	\N
8052	\N	\N
8439	\N	\N
2375	\N	\N
4388	\N	\N
8914	\N	\N
5776	\N	\N
8154	\N	\N
9157	\N	\N
7593	\N	\N
8097	\N	\N
3932	\N	\N
3735	\N	\N
4723	\N	\N
3157	\N	\N
3525	\N	\N
3988	\N	\N
8903	\N	\N
4253	\N	\N
2161	\N	\N
1139	\N	\N
6288	\N	\N
1326	\N	\N
4891	\N	\N
6692	\N	\N
6006	\N	\N
8842	\N	\N
4588	\N	\N
5032	\N	\N
4162	\N	\N
9046	\N	\N
7975	\N	\N
2799	\N	\N
2699	\N	\N
2824	\N	\N
7985	\N	\N
1832	\N	\N
5980	\N	\N
6805	\N	\N
5833	\N	\N
3663	\N	\N
9002	\N	\N
2262	\N	\N
2180	\N	\N
5998	\N	\N
2134	\N	\N
6953	\N	\N
8240	\N	\N
4312	\N	\N
5482	\N	\N
6827	\N	\N
6457	\N	\N
1854	\N	\N
3692	\N	\N
3597	\N	\N
4351	\N	\N
2486	\N	\N
3948	\N	\N
8934	\N	\N
7193	\N	\N
8400	\N	\N
5222	\N	\N
6597	\N	\N
1649	\N	\N
4593	\N	\N
4233	\N	\N
8807	\N	\N
1281	\N	\N
8667	\N	\N
7134	\N	\N
7950	\N	\N
2168	\N	\N
2050	\N	\N
2395	\N	\N
9352	\N	\N
3070	\N	\N
3450	\N	\N
9767	\N	\N
8894	\N	\N
2306	\N	\N
7733	\N	\N
1398	\N	\N
6163	\N	\N
9482	\N	\N
9120	\N	\N
5622	\N	\N
5592	\N	\N
1090	\N	\N
6630	\N	\N
8457	\N	\N
4811	\N	\N
3825	\N	\N
9864	\N	\N
9170	\N	\N
4335	\N	\N
6894	\N	\N
4029	\N	\N
6524	\N	\N
3424	\N	\N
4155	\N	\N
3546	\N	\N
4037	\N	\N
3678	\N	\N
3732	\N	\N
5287	\N	\N
9246	\N	\N
8731	\N	\N
8897	\N	\N
4488	\N	\N
2263	\N	\N
6140	\N	\N
4571	\N	\N
1092	\N	\N
2845	\N	\N
2861	\N	\N
6720	\N	\N
2087	\N	\N
6777	\N	\N
4074	\N	\N
2182	\N	\N
6541	\N	\N
9312	\N	\N
6279	\N	\N
3697	\N	\N
5770	\N	\N
1437	\N	\N
7311	\N	\N
1008	\N	\N
3727	\N	\N
5901	\N	\N
6616	\N	\N
1114	\N	\N
1463	\N	\N
1594	\N	\N
3728	\N	\N
5467	\N	\N
3105	\N	\N
7392	\N	\N
2918	\N	\N
6803	\N	\N
4227	\N	\N
1516	\N	\N
7930	\N	\N
6543	\N	\N
4020	\N	\N
1063	\N	\N
9454	\N	\N
8988	\N	\N
1171	\N	\N
1577	\N	\N
6928	\N	\N
9743	\N	\N
4385	\N	\N
1528	\N	\N
3621	\N	\N
4615	\N	\N
7842	\N	\N
8271	\N	\N
7448	\N	\N
6730	\N	\N
1914	\N	\N
5426	\N	\N
1893	\N	\N
7852	\N	\N
6181	\N	\N
3507	\N	\N
1252	\N	\N
4886	\N	\N
6999	\N	\N
7838	\N	\N
7367	\N	\N
2881	\N	\N
4413	\N	\N
7619	\N	\N
8213	\N	\N
7681	\N	\N
8066	\N	\N
3098	\N	\N
4285	\N	\N
5948	\N	\N
3103	\N	\N
5912	\N	\N
6596	\N	\N
3618	\N	\N
8047	\N	\N
9860	\N	\N
3159	\N	\N
4603	\N	\N
1541	\N	\N
3649	\N	\N
1653	\N	\N
7182	\N	\N
6136	\N	\N
8634	\N	\N
4907	\N	\N
2661	\N	\N
5218	\N	\N
2505	\N	\N
8795	\N	\N
5269	\N	\N
6542	\N	\N
9643	\N	\N
5916	\N	\N
6199	\N	\N
2494	\N	\N
2145	\N	\N
2240	\N	\N
3315	\N	\N
1699	\N	\N
2020	\N	\N
2176	\N	\N
3292	\N	\N
8102	\N	\N
2343	\N	\N
5506	\N	\N
8186	\N	\N
8083	\N	\N
\.


--
-- Data for Name: enterprise_plans; Type: TABLE DATA; Schema: public; Owner: plausible
--

COPY public.enterprise_plans (id, user_id, paddle_plan_id, billing_interval, monthly_pageview_limit, hourly_api_request_limit, inserted_at, updated_at, site_limit) FROM stdin;
\.


--
-- Data for Name: feedback_emails; Type: TABLE DATA; Schema: public; Owner: plausible
--

COPY public.feedback_emails (id, user_id, "timestamp") FROM stdin;
\.


--
-- Data for Name: fun_with_flags_toggles; Type: TABLE DATA; Schema: public; Owner: plausible
--

COPY public.fun_with_flags_toggles (id, flag_name, gate_type, target, enabled) FROM stdin;
\.


--
-- Data for Name: goals; Type: TABLE DATA; Schema: public; Owner: plausible
--

COPY public.goals (id, domain, event_name, page_path, inserted_at, updated_at) FROM stdin;
1	localtest.me	Outbound Link: Click	\N	2022-10-02 18:37:10	2022-10-02 18:37:10
2	localtest.me	File Download	\N	2022-10-02 18:37:15	2022-10-02 18:37:15
3	localtest.me	404	\N	2022-10-02 18:37:19	2022-10-02 18:37:19
4	localtest.me	Logout	\N	2022-10-02 18:37:23	2022-10-02 18:37:23
5	localtest.me	Login	\N	2022-10-02 18:37:27	2022-10-02 18:37:27
6	localtest.me	Signup	\N	2022-10-02 18:37:32	2022-10-02 18:37:32
7	localtest.me	Recovery: Success	\N	2022-10-02 18:37:37	2022-10-02 18:37:37
8	localtest.me	Recovery: Failure	\N	2022-10-02 18:37:42	2022-10-02 18:37:42
9	localtest.me	Verification: Success	\N	2022-10-02 18:37:46	2022-10-02 18:37:46
10	localtest.me	Verification: Failure	\N	2022-10-02 18:37:52	2022-10-02 18:37:52
11	localtest.me	Locale Changed	\N	2022-10-02 18:37:58	2022-10-02 18:37:58
\.


--
-- Data for Name: google_auth; Type: TABLE DATA; Schema: public; Owner: plausible
--

COPY public.google_auth (id, user_id, email, refresh_token, access_token, expires, inserted_at, updated_at, site_id, property) FROM stdin;
\.


--
-- Data for Name: intro_emails; Type: TABLE DATA; Schema: public; Owner: plausible
--

COPY public.intro_emails (id, user_id, "timestamp") FROM stdin;
\.


--
-- Data for Name: invitations; Type: TABLE DATA; Schema: public; Owner: plausible
--

COPY public.invitations (id, email, site_id, inviter_id, role, invitation_id, inserted_at, updated_at) FROM stdin;
\.


--
-- Data for Name: monthly_reports; Type: TABLE DATA; Schema: public; Owner: plausible
--

COPY public.monthly_reports (id, site_id, inserted_at, updated_at, recipients) FROM stdin;
1	1	2022-10-02 18:38:07	2022-10-02 18:38:07	{macadam@localtest.me}
\.


--
-- Data for Name: oban_jobs; Type: TABLE DATA; Schema: public; Owner: plausible
--

COPY public.oban_jobs (id, state, queue, worker, args, errors, attempt, max_attempts, inserted_at, scheduled_at, attempted_at, completed_at, attempted_by, discarded_at, priority, tags, meta, cancelled_at) FROM stdin;
\.


--
-- Data for Name: oban_peers; Type: TABLE DATA; Schema: public; Owner: plausible
--

COPY public.oban_peers (name, node, started_at, expires_at) FROM stdin;
Oban	plausible@7a61bc5395f8	2022-10-02 18:36:57.987139	2022-10-02 18:39:07.508581
\.


--
-- Data for Name: salts; Type: TABLE DATA; Schema: public; Owner: plausible
--

COPY public.salts (id, salt, inserted_at) FROM stdin;
1	\\xd57910bbbbcdfa878ed59c240de7d3c2	2022-10-02 14:49:13
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: public; Owner: plausible
--

COPY public.schema_migrations (version, inserted_at) FROM stdin;
20181201181549	2022-10-02 14:49:01
20181214201821	2022-10-02 14:49:01
20181215140923	2022-10-02 14:49:01
20190109173917	2022-10-02 14:49:01
20190117135714	2022-10-02 14:49:01
20190118154210	2022-10-02 14:49:01
20190126135857	2022-10-02 14:49:01
20190127213938	2022-10-02 14:49:01
20190205165931	2022-10-02 14:49:01
20190213224404	2022-10-02 14:49:01
20190219130809	2022-10-02 14:49:01
20190301122344	2022-10-02 14:49:01
20190324155606	2022-10-02 14:49:01
20190402145007	2022-10-02 14:49:01
20190402145357	2022-10-02 14:49:01
20190402172423	2022-10-02 14:49:01
20190410095248	2022-10-02 14:49:01
20190424162903	2022-10-02 14:49:01
20190430140411	2022-10-02 14:49:01
20190430152923	2022-10-02 14:49:01
20190516113517	2022-10-02 14:49:01
20190520144229	2022-10-02 14:49:01
20190523160838	2022-10-02 14:49:01
20190523171519	2022-10-02 14:49:01
20190618165016	2022-10-02 14:49:01
20190718160353	2022-10-02 14:49:01
20190723141824	2022-10-02 14:49:01
20190730014913	2022-10-02 14:49:01
20190730142200	2022-10-02 14:49:01
20190730144413	2022-10-02 14:49:01
20190809174105	2022-10-02 14:49:01
20190810145419	2022-10-02 14:49:01
20190820140747	2022-10-02 14:49:01
20190906111810	2022-10-02 14:49:01
20190907134114	2022-10-02 14:49:01
20190910120900	2022-10-02 14:49:01
20190911102027	2022-10-02 14:49:01
20191010031425	2022-10-02 14:49:01
20191015072730	2022-10-02 14:49:01
20191015073507	2022-10-02 14:49:01
20191024062200	2022-10-02 14:49:01
20191025055334	2022-10-02 14:49:01
20191031051340	2022-10-02 14:49:01
20191031063001	2022-10-02 14:49:01
20191118075359	2022-10-02 14:49:01
20191216064647	2022-10-02 14:49:01
20191218082207	2022-10-02 14:49:01
20191220042658	2022-10-02 14:49:01
20200106090739	2022-10-02 14:49:01
20200107095234	2022-10-02 14:49:01
20200113143927	2022-10-02 14:49:01
20200114131538	2022-10-02 14:49:01
20200120091134	2022-10-02 14:49:01
20200121091251	2022-10-02 14:49:01
20200122150130	2022-10-02 14:49:01
20200130123049	2022-10-02 14:49:01
20200204093801	2022-10-02 14:49:01
20200204133522	2022-10-02 14:49:01
20200210134612	2022-10-02 14:49:01
20200211080841	2022-10-02 14:49:01
20200211090126	2022-10-02 14:49:01
20200211133829	2022-10-02 14:49:01
20200219124314	2022-10-02 14:49:01
20200227092821	2022-10-02 14:49:01
20200302105632	2022-10-02 14:49:01
20200317093028	2022-10-02 14:49:01
20200317142459	2022-10-02 14:49:01
20200320100803	2022-10-02 14:49:01
20200323083536	2022-10-02 14:49:01
20200323084954	2022-10-02 14:49:01
20200324132431	2022-10-02 14:49:01
20200406115153	2022-10-02 14:49:01
20200408122329	2022-10-02 14:49:02
20200529071028	2022-10-02 14:49:02
20200605134616	2022-10-02 14:49:02
20200605142737	2022-10-02 14:49:02
20200619071221	2022-10-02 14:49:02
20201130083829	2022-10-02 14:49:02
20201208173543	2022-10-02 14:49:02
20201210085345	2022-10-02 14:49:02
20201214072008	2022-10-02 14:49:02
20201230085939	2022-10-02 14:49:02
20210115092331	2022-10-02 14:49:02
20210119093337	2022-10-02 14:49:02
20210128083453	2022-10-02 14:49:02
20210128084657	2022-10-02 14:49:02
20210209095257	2022-10-02 14:49:02
20210406073254	2022-10-02 14:49:02
20210409074413	2022-10-02 14:49:02
20210409082603	2022-10-02 14:49:02
20210420075623	2022-10-02 14:49:02
20210426075157	2022-10-02 14:49:02
20210513091653	2022-10-02 14:49:02
20210525085655	2022-10-02 14:49:02
20210531080158	2022-10-02 14:49:02
20210601090924	2022-10-02 14:49:02
20210604085943	2022-10-02 14:49:02
20210629124428	2022-10-02 14:49:02
20210726090211	2022-10-02 14:49:02
20210906102736	2022-10-02 14:49:02
20210908081119	2022-10-02 14:49:02
20211020093238	2022-10-02 14:49:02
20211022084427	2022-10-02 14:49:02
20211028122202	2022-10-02 14:49:02
20211110174617	2022-10-02 14:49:02
20211202094732	2022-10-02 14:49:02
20220405124819	2022-10-02 14:49:02
20220408071645	2022-10-02 14:49:02
20220408080058	2022-10-02 14:49:02
20220421074114	2022-10-02 14:49:02
\.


--
-- Data for Name: sent_monthly_reports; Type: TABLE DATA; Schema: public; Owner: plausible
--

COPY public.sent_monthly_reports (id, site_id, year, month, "timestamp") FROM stdin;
\.


--
-- Data for Name: sent_renewal_notifications; Type: TABLE DATA; Schema: public; Owner: plausible
--

COPY public.sent_renewal_notifications (id, user_id, "timestamp") FROM stdin;
\.


--
-- Data for Name: sent_weekly_reports; Type: TABLE DATA; Schema: public; Owner: plausible
--

COPY public.sent_weekly_reports (id, site_id, year, week, "timestamp") FROM stdin;
\.


--
-- Data for Name: setup_help_emails; Type: TABLE DATA; Schema: public; Owner: plausible
--

COPY public.setup_help_emails (id, site_id, "timestamp") FROM stdin;
\.


--
-- Data for Name: setup_success_emails; Type: TABLE DATA; Schema: public; Owner: plausible
--

COPY public.setup_success_emails (id, site_id, "timestamp") FROM stdin;
\.


--
-- Data for Name: shared_links; Type: TABLE DATA; Schema: public; Owner: plausible
--

COPY public.shared_links (id, site_id, slug, password_hash, inserted_at, updated_at, name) FROM stdin;
\.


--
-- Data for Name: site_memberships; Type: TABLE DATA; Schema: public; Owner: plausible
--

COPY public.site_memberships (id, site_id, user_id, inserted_at, updated_at, role) FROM stdin;
1	1	1	2022-10-02 14:51:38	2022-10-02 14:51:38	owner
\.


--
-- Data for Name: sites; Type: TABLE DATA; Schema: public; Owner: plausible
--

COPY public.sites (id, domain, inserted_at, updated_at, timezone, public, locked, has_stats, imported_data, stats_start_date) FROM stdin;
1	localtest.me	2022-10-02 14:51:38	2022-10-02 18:38:18	America/New_York	t	f	f	\N	2022-10-02
\.


--
-- Data for Name: spike_notifications; Type: TABLE DATA; Schema: public; Owner: plausible
--

COPY public.spike_notifications (id, site_id, threshold, last_sent, recipients, inserted_at, updated_at) FROM stdin;
1	1	10	\N	{macadam@localtest.me}	2022-10-02 18:38:04	2022-10-02 18:38:04
\.


--
-- Data for Name: subscriptions; Type: TABLE DATA; Schema: public; Owner: plausible
--

COPY public.subscriptions (id, paddle_subscription_id, paddle_plan_id, user_id, update_url, cancel_url, status, next_bill_amount, next_bill_date, inserted_at, updated_at, last_bill_date, currency_code) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: plausible
--

COPY public.users (id, email, inserted_at, updated_at, name, last_seen, password_hash, trial_expiry_date, email_verified, theme, grace_period) FROM stdin;
1	macadam@localtest.me	2022-10-02 14:49:02	2022-10-02 14:49:02	macadam	2022-10-02 14:49:03	$2b$12$8R346rDCrzNGKjhwXsfiYOGnuhdq0au3CNesAk.6P33kh4qEHwCsu	2122-10-02	t	system	\N
\.


--
-- Data for Name: weekly_reports; Type: TABLE DATA; Schema: public; Owner: plausible
--

COPY public.weekly_reports (id, site_id, inserted_at, updated_at, recipients) FROM stdin;
1	1	2022-10-02 18:38:09	2022-10-02 18:38:09	{macadam@localtest.me}
\.


--
-- Name: api_keys_id_seq; Type: SEQUENCE SET; Schema: public; Owner: plausible
--

SELECT pg_catalog.setval('public.api_keys_id_seq', 1, false);


--
-- Name: check_stats_emails_id_seq; Type: SEQUENCE SET; Schema: public; Owner: plausible
--

SELECT pg_catalog.setval('public.check_stats_emails_id_seq', 1, false);


--
-- Name: create_site_emails_id_seq; Type: SEQUENCE SET; Schema: public; Owner: plausible
--

SELECT pg_catalog.setval('public.create_site_emails_id_seq', 1, false);


--
-- Name: custom_domains_id_seq; Type: SEQUENCE SET; Schema: public; Owner: plausible
--

SELECT pg_catalog.setval('public.custom_domains_id_seq', 1, false);


--
-- Name: enterprise_plans_id_seq; Type: SEQUENCE SET; Schema: public; Owner: plausible
--

SELECT pg_catalog.setval('public.enterprise_plans_id_seq', 1, false);


--
-- Name: feedback_emails_id_seq; Type: SEQUENCE SET; Schema: public; Owner: plausible
--

SELECT pg_catalog.setval('public.feedback_emails_id_seq', 1, false);


--
-- Name: fun_with_flags_toggles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: plausible
--

SELECT pg_catalog.setval('public.fun_with_flags_toggles_id_seq', 1, false);


--
-- Name: goals_id_seq; Type: SEQUENCE SET; Schema: public; Owner: plausible
--

SELECT pg_catalog.setval('public.goals_id_seq', 11, true);


--
-- Name: google_auth_id_seq; Type: SEQUENCE SET; Schema: public; Owner: plausible
--

SELECT pg_catalog.setval('public.google_auth_id_seq', 1, false);


--
-- Name: intro_emails_id_seq; Type: SEQUENCE SET; Schema: public; Owner: plausible
--

SELECT pg_catalog.setval('public.intro_emails_id_seq', 1, false);


--
-- Name: invitations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: plausible
--

SELECT pg_catalog.setval('public.invitations_id_seq', 1, false);


--
-- Name: monthly_reports_id_seq; Type: SEQUENCE SET; Schema: public; Owner: plausible
--

SELECT pg_catalog.setval('public.monthly_reports_id_seq', 1, true);


--
-- Name: oban_jobs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: plausible
--

SELECT pg_catalog.setval('public.oban_jobs_id_seq', 1, false);


--
-- Name: salts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: plausible
--

SELECT pg_catalog.setval('public.salts_id_seq', 1, true);


--
-- Name: sent_monthly_reports_id_seq; Type: SEQUENCE SET; Schema: public; Owner: plausible
--

SELECT pg_catalog.setval('public.sent_monthly_reports_id_seq', 1, false);


--
-- Name: sent_renewal_notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: plausible
--

SELECT pg_catalog.setval('public.sent_renewal_notifications_id_seq', 1, false);


--
-- Name: sent_weekly_reports_id_seq; Type: SEQUENCE SET; Schema: public; Owner: plausible
--

SELECT pg_catalog.setval('public.sent_weekly_reports_id_seq', 1, false);


--
-- Name: setup_help_emails_id_seq; Type: SEQUENCE SET; Schema: public; Owner: plausible
--

SELECT pg_catalog.setval('public.setup_help_emails_id_seq', 1, false);


--
-- Name: setup_success_emails_id_seq; Type: SEQUENCE SET; Schema: public; Owner: plausible
--

SELECT pg_catalog.setval('public.setup_success_emails_id_seq', 1, false);


--
-- Name: shared_links_id_seq; Type: SEQUENCE SET; Schema: public; Owner: plausible
--

SELECT pg_catalog.setval('public.shared_links_id_seq', 1, false);


--
-- Name: site_memberships_id_seq; Type: SEQUENCE SET; Schema: public; Owner: plausible
--

SELECT pg_catalog.setval('public.site_memberships_id_seq', 1, true);


--
-- Name: sites_id_seq; Type: SEQUENCE SET; Schema: public; Owner: plausible
--

SELECT pg_catalog.setval('public.sites_id_seq', 1, true);


--
-- Name: spike_notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: plausible
--

SELECT pg_catalog.setval('public.spike_notifications_id_seq', 1, true);


--
-- Name: subscriptions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: plausible
--

SELECT pg_catalog.setval('public.subscriptions_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: plausible
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- Name: weekly_reports_id_seq; Type: SEQUENCE SET; Schema: public; Owner: plausible
--

SELECT pg_catalog.setval('public.weekly_reports_id_seq', 1, true);


--
-- Name: api_keys api_keys_pkey; Type: CONSTRAINT; Schema: public; Owner: plausible
--

ALTER TABLE ONLY public.api_keys
    ADD CONSTRAINT api_keys_pkey PRIMARY KEY (id);


--
-- Name: check_stats_emails check_stats_emails_pkey; Type: CONSTRAINT; Schema: public; Owner: plausible
--

ALTER TABLE ONLY public.check_stats_emails
    ADD CONSTRAINT check_stats_emails_pkey PRIMARY KEY (id);


--
-- Name: create_site_emails create_site_emails_pkey; Type: CONSTRAINT; Schema: public; Owner: plausible
--

ALTER TABLE ONLY public.create_site_emails
    ADD CONSTRAINT create_site_emails_pkey PRIMARY KEY (id);


--
-- Name: custom_domains custom_domains_pkey; Type: CONSTRAINT; Schema: public; Owner: plausible
--

ALTER TABLE ONLY public.custom_domains
    ADD CONSTRAINT custom_domains_pkey PRIMARY KEY (id);


--
-- Name: enterprise_plans enterprise_plans_pkey; Type: CONSTRAINT; Schema: public; Owner: plausible
--

ALTER TABLE ONLY public.enterprise_plans
    ADD CONSTRAINT enterprise_plans_pkey PRIMARY KEY (id);


--
-- Name: feedback_emails feedback_emails_pkey; Type: CONSTRAINT; Schema: public; Owner: plausible
--

ALTER TABLE ONLY public.feedback_emails
    ADD CONSTRAINT feedback_emails_pkey PRIMARY KEY (id);


--
-- Name: fun_with_flags_toggles fun_with_flags_toggles_pkey; Type: CONSTRAINT; Schema: public; Owner: plausible
--

ALTER TABLE ONLY public.fun_with_flags_toggles
    ADD CONSTRAINT fun_with_flags_toggles_pkey PRIMARY KEY (id);


--
-- Name: goals goals_pkey; Type: CONSTRAINT; Schema: public; Owner: plausible
--

ALTER TABLE ONLY public.goals
    ADD CONSTRAINT goals_pkey PRIMARY KEY (id);


--
-- Name: google_auth google_auth_pkey; Type: CONSTRAINT; Schema: public; Owner: plausible
--

ALTER TABLE ONLY public.google_auth
    ADD CONSTRAINT google_auth_pkey PRIMARY KEY (id);


--
-- Name: intro_emails intro_emails_pkey; Type: CONSTRAINT; Schema: public; Owner: plausible
--

ALTER TABLE ONLY public.intro_emails
    ADD CONSTRAINT intro_emails_pkey PRIMARY KEY (id);


--
-- Name: invitations invitations_pkey; Type: CONSTRAINT; Schema: public; Owner: plausible
--

ALTER TABLE ONLY public.invitations
    ADD CONSTRAINT invitations_pkey PRIMARY KEY (id);


--
-- Name: monthly_reports monthly_reports_pkey; Type: CONSTRAINT; Schema: public; Owner: plausible
--

ALTER TABLE ONLY public.monthly_reports
    ADD CONSTRAINT monthly_reports_pkey PRIMARY KEY (id);


--
-- Name: oban_jobs oban_jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: plausible
--

ALTER TABLE ONLY public.oban_jobs
    ADD CONSTRAINT oban_jobs_pkey PRIMARY KEY (id);


--
-- Name: oban_peers oban_peers_pkey; Type: CONSTRAINT; Schema: public; Owner: plausible
--

ALTER TABLE ONLY public.oban_peers
    ADD CONSTRAINT oban_peers_pkey PRIMARY KEY (name);


--
-- Name: salts salts_pkey; Type: CONSTRAINT; Schema: public; Owner: plausible
--

ALTER TABLE ONLY public.salts
    ADD CONSTRAINT salts_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: plausible
--

ALTER TABLE ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: sent_monthly_reports sent_monthly_reports_pkey; Type: CONSTRAINT; Schema: public; Owner: plausible
--

ALTER TABLE ONLY public.sent_monthly_reports
    ADD CONSTRAINT sent_monthly_reports_pkey PRIMARY KEY (id);


--
-- Name: sent_renewal_notifications sent_renewal_notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: plausible
--

ALTER TABLE ONLY public.sent_renewal_notifications
    ADD CONSTRAINT sent_renewal_notifications_pkey PRIMARY KEY (id);


--
-- Name: sent_weekly_reports sent_weekly_reports_pkey; Type: CONSTRAINT; Schema: public; Owner: plausible
--

ALTER TABLE ONLY public.sent_weekly_reports
    ADD CONSTRAINT sent_weekly_reports_pkey PRIMARY KEY (id);


--
-- Name: setup_help_emails setup_help_emails_pkey; Type: CONSTRAINT; Schema: public; Owner: plausible
--

ALTER TABLE ONLY public.setup_help_emails
    ADD CONSTRAINT setup_help_emails_pkey PRIMARY KEY (id);


--
-- Name: setup_success_emails setup_success_emails_pkey; Type: CONSTRAINT; Schema: public; Owner: plausible
--

ALTER TABLE ONLY public.setup_success_emails
    ADD CONSTRAINT setup_success_emails_pkey PRIMARY KEY (id);


--
-- Name: shared_links shared_links_pkey; Type: CONSTRAINT; Schema: public; Owner: plausible
--

ALTER TABLE ONLY public.shared_links
    ADD CONSTRAINT shared_links_pkey PRIMARY KEY (id);


--
-- Name: site_memberships site_memberships_pkey; Type: CONSTRAINT; Schema: public; Owner: plausible
--

ALTER TABLE ONLY public.site_memberships
    ADD CONSTRAINT site_memberships_pkey PRIMARY KEY (id);


--
-- Name: sites sites_pkey; Type: CONSTRAINT; Schema: public; Owner: plausible
--

ALTER TABLE ONLY public.sites
    ADD CONSTRAINT sites_pkey PRIMARY KEY (id);


--
-- Name: spike_notifications spike_notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: plausible
--

ALTER TABLE ONLY public.spike_notifications
    ADD CONSTRAINT spike_notifications_pkey PRIMARY KEY (id);


--
-- Name: subscriptions subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: plausible
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: plausible
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: weekly_reports weekly_reports_pkey; Type: CONSTRAINT; Schema: public; Owner: plausible
--

ALTER TABLE ONLY public.weekly_reports
    ADD CONSTRAINT weekly_reports_pkey PRIMARY KEY (id);


--
-- Name: api_keys_scopes_index; Type: INDEX; Schema: public; Owner: plausible
--

CREATE INDEX api_keys_scopes_index ON public.api_keys USING gin (scopes);


--
-- Name: custom_domains_site_id_index; Type: INDEX; Schema: public; Owner: plausible
--

CREATE UNIQUE INDEX custom_domains_site_id_index ON public.custom_domains USING btree (site_id);


--
-- Name: fwf_flag_name_gate_target_idx; Type: INDEX; Schema: public; Owner: plausible
--

CREATE UNIQUE INDEX fwf_flag_name_gate_target_idx ON public.fun_with_flags_toggles USING btree (flag_name, gate_type, target);


--
-- Name: google_auth_site_id_index; Type: INDEX; Schema: public; Owner: plausible
--

CREATE UNIQUE INDEX google_auth_site_id_index ON public.google_auth USING btree (site_id);


--
-- Name: invitations_invitation_id_index; Type: INDEX; Schema: public; Owner: plausible
--

CREATE UNIQUE INDEX invitations_invitation_id_index ON public.invitations USING btree (invitation_id);


--
-- Name: invitations_site_id_email_index; Type: INDEX; Schema: public; Owner: plausible
--

CREATE UNIQUE INDEX invitations_site_id_email_index ON public.invitations USING btree (site_id, email);


--
-- Name: monthly_reports_site_id_index; Type: INDEX; Schema: public; Owner: plausible
--

CREATE UNIQUE INDEX monthly_reports_site_id_index ON public.monthly_reports USING btree (site_id);


--
-- Name: oban_jobs_args_index; Type: INDEX; Schema: public; Owner: plausible
--

CREATE INDEX oban_jobs_args_index ON public.oban_jobs USING gin (args);


--
-- Name: oban_jobs_meta_index; Type: INDEX; Schema: public; Owner: plausible
--

CREATE INDEX oban_jobs_meta_index ON public.oban_jobs USING gin (meta);


--
-- Name: oban_jobs_state_queue_priority_scheduled_at_id_index; Type: INDEX; Schema: public; Owner: plausible
--

CREATE INDEX oban_jobs_state_queue_priority_scheduled_at_id_index ON public.oban_jobs USING btree (state, queue, priority, scheduled_at, id);


--
-- Name: shared_links_site_id_name_index; Type: INDEX; Schema: public; Owner: plausible
--

CREATE UNIQUE INDEX shared_links_site_id_name_index ON public.shared_links USING btree (site_id, name);


--
-- Name: site_memberships_site_id_user_id_index; Type: INDEX; Schema: public; Owner: plausible
--

CREATE UNIQUE INDEX site_memberships_site_id_user_id_index ON public.site_memberships USING btree (site_id, user_id);


--
-- Name: sites_domain_index; Type: INDEX; Schema: public; Owner: plausible
--

CREATE UNIQUE INDEX sites_domain_index ON public.sites USING btree (domain);


--
-- Name: spike_notifications_site_id_index; Type: INDEX; Schema: public; Owner: plausible
--

CREATE UNIQUE INDEX spike_notifications_site_id_index ON public.spike_notifications USING btree (site_id);


--
-- Name: subscriptions_paddle_subscription_id_index; Type: INDEX; Schema: public; Owner: plausible
--

CREATE UNIQUE INDEX subscriptions_paddle_subscription_id_index ON public.subscriptions USING btree (paddle_subscription_id);


--
-- Name: users_email_index; Type: INDEX; Schema: public; Owner: plausible
--

CREATE UNIQUE INDEX users_email_index ON public.users USING btree (email);


--
-- Name: weekly_reports_site_id_index; Type: INDEX; Schema: public; Owner: plausible
--

CREATE UNIQUE INDEX weekly_reports_site_id_index ON public.weekly_reports USING btree (site_id);


--
-- Name: oban_jobs oban_notify; Type: TRIGGER; Schema: public; Owner: plausible
--

CREATE TRIGGER oban_notify AFTER INSERT ON public.oban_jobs FOR EACH ROW EXECUTE FUNCTION public.oban_jobs_notify();


--
-- Name: api_keys api_keys_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: plausible
--

ALTER TABLE ONLY public.api_keys
    ADD CONSTRAINT api_keys_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: check_stats_emails check_stats_emails_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: plausible
--

ALTER TABLE ONLY public.check_stats_emails
    ADD CONSTRAINT check_stats_emails_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: create_site_emails create_site_emails_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: plausible
--

ALTER TABLE ONLY public.create_site_emails
    ADD CONSTRAINT create_site_emails_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: custom_domains custom_domains_site_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: plausible
--

ALTER TABLE ONLY public.custom_domains
    ADD CONSTRAINT custom_domains_site_id_fkey FOREIGN KEY (site_id) REFERENCES public.sites(id) ON DELETE CASCADE;


--
-- Name: email_verification_codes email_verification_codes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: plausible
--

ALTER TABLE ONLY public.email_verification_codes
    ADD CONSTRAINT email_verification_codes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: enterprise_plans enterprise_plans_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: plausible
--

ALTER TABLE ONLY public.enterprise_plans
    ADD CONSTRAINT enterprise_plans_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: feedback_emails feedback_emails_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: plausible
--

ALTER TABLE ONLY public.feedback_emails
    ADD CONSTRAINT feedback_emails_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: google_auth google_auth_site_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: plausible
--

ALTER TABLE ONLY public.google_auth
    ADD CONSTRAINT google_auth_site_id_fkey FOREIGN KEY (site_id) REFERENCES public.sites(id) ON DELETE CASCADE;


--
-- Name: google_auth google_auth_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: plausible
--

ALTER TABLE ONLY public.google_auth
    ADD CONSTRAINT google_auth_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: intro_emails intro_emails_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: plausible
--

ALTER TABLE ONLY public.intro_emails
    ADD CONSTRAINT intro_emails_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: invitations invitations_inviter_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: plausible
--

ALTER TABLE ONLY public.invitations
    ADD CONSTRAINT invitations_inviter_id_fkey FOREIGN KEY (inviter_id) REFERENCES public.users(id);


--
-- Name: invitations invitations_site_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: plausible
--

ALTER TABLE ONLY public.invitations
    ADD CONSTRAINT invitations_site_id_fkey FOREIGN KEY (site_id) REFERENCES public.sites(id) ON DELETE CASCADE;


--
-- Name: monthly_reports monthly_reports_site_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: plausible
--

ALTER TABLE ONLY public.monthly_reports
    ADD CONSTRAINT monthly_reports_site_id_fkey FOREIGN KEY (site_id) REFERENCES public.sites(id) ON DELETE CASCADE;


--
-- Name: sent_monthly_reports sent_monthly_reports_site_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: plausible
--

ALTER TABLE ONLY public.sent_monthly_reports
    ADD CONSTRAINT sent_monthly_reports_site_id_fkey FOREIGN KEY (site_id) REFERENCES public.sites(id) ON DELETE CASCADE;


--
-- Name: sent_renewal_notifications sent_renewal_notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: plausible
--

ALTER TABLE ONLY public.sent_renewal_notifications
    ADD CONSTRAINT sent_renewal_notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: sent_weekly_reports sent_weekly_reports_site_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: plausible
--

ALTER TABLE ONLY public.sent_weekly_reports
    ADD CONSTRAINT sent_weekly_reports_site_id_fkey FOREIGN KEY (site_id) REFERENCES public.sites(id) ON DELETE CASCADE;


--
-- Name: setup_help_emails setup_help_emails_site_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: plausible
--

ALTER TABLE ONLY public.setup_help_emails
    ADD CONSTRAINT setup_help_emails_site_id_fkey FOREIGN KEY (site_id) REFERENCES public.sites(id) ON DELETE CASCADE;


--
-- Name: setup_success_emails setup_success_emails_site_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: plausible
--

ALTER TABLE ONLY public.setup_success_emails
    ADD CONSTRAINT setup_success_emails_site_id_fkey FOREIGN KEY (site_id) REFERENCES public.sites(id) ON DELETE CASCADE;


--
-- Name: shared_links shared_links_site_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: plausible
--

ALTER TABLE ONLY public.shared_links
    ADD CONSTRAINT shared_links_site_id_fkey FOREIGN KEY (site_id) REFERENCES public.sites(id) ON DELETE CASCADE;


--
-- Name: site_memberships site_memberships_site_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: plausible
--

ALTER TABLE ONLY public.site_memberships
    ADD CONSTRAINT site_memberships_site_id_fkey FOREIGN KEY (site_id) REFERENCES public.sites(id) ON DELETE CASCADE;


--
-- Name: site_memberships site_memberships_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: plausible
--

ALTER TABLE ONLY public.site_memberships
    ADD CONSTRAINT site_memberships_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: spike_notifications spike_notifications_site_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: plausible
--

ALTER TABLE ONLY public.spike_notifications
    ADD CONSTRAINT spike_notifications_site_id_fkey FOREIGN KEY (site_id) REFERENCES public.sites(id) ON DELETE CASCADE;


--
-- Name: subscriptions subscriptions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: plausible
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: weekly_reports weekly_reports_site_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: plausible
--

ALTER TABLE ONLY public.weekly_reports
    ADD CONSTRAINT weekly_reports_site_id_fkey FOREIGN KEY (site_id) REFERENCES public.sites(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

